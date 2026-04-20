package com.palmyralabs.dms.demo.generator.stages;

import com.fasterxml.jackson.databind.JsonNode;
import com.palmyralabs.dms.demo.generator.model.DocStatus;
import com.palmyralabs.dms.demo.generator.PipelineContext;
import com.palmyralabs.dms.demo.generator.util.AgeBands;
import com.palmyralabs.dms.demo.generator.util.DateUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Stage 3: monthly aggregator (WINDOW_MONTHS = 24 calendar months ending
 * with the month of REF_DATE). NO case-selection filter here - per spec,
 * all source cases feed the aggregator and per-document, per-month rules
 * decide bucket contribution.
 * Matches {@code specs/aggregation/active_cases_monthly_agg_spec.txt}.
 */
@Slf4j
@Component
public class Stage3MonthlyAggregator {

    private static final int WINDOW_MONTHS = 24;

    public void run(PipelineContext ctx) throws IOException {
        Path inPath = ctx.allCasesPath();
        Path outPath = ctx.getDataDir().resolve("active_cases_monthly_branchwise.json");
        String REF_DATE = ctx.getReportToday();
        String REF_FIRST = DateUtil.firstOfMonth(REF_DATE);

        List<String> calMonths = new ArrayList<>(WINDOW_MONTHS);
        for (int k = WINDOW_MONTHS - 1; k >= 0; k--) {
            calMonths.add(DateUtil.addMonthsToFirst(REF_FIRST, -k));
        }
        Map<String, String> monthEnd = new HashMap<>();
        for (String cm : calMonths) {
            String lastDay = DateUtil.lastOfMonth(cm);
            monthEnd.put(cm, lastDay.compareTo(REF_DATE) <= 0 ? lastDay : REF_DATE);
        }
        String WINDOW_START = calMonths.get(0);

        Map<String, Bucket> buckets = new LinkedHashMap<>();
        int[] stats = { 0 };  // lines

        Stage3Common.streamJsonl(inPath, rec -> {
            stats[0]++;
            JsonNode docs = rec.get("documents");
            if (docs == null || !docs.isArray()) return;
            for (JsonNode d : docs) {
                String status = text(d, "status");
                String uploadedOn = text(d, "uploadedOn");
                String actionOn = text(d, "actionOn");
                String approvedBy = text(d, "approvedBy");

                // submittedDocuments (first-of-month of uploadedOn).
                if (uploadedOn.compareTo(WINDOW_START) >= 0 && uploadedOn.compareTo(REF_DATE) <= 0) {
                    String cm = DateUtil.firstOfMonth(uploadedOn);
                    getBucket(buckets, cm, rec).submitted++;
                }
                // processedDocuments + perApprover.
                if (!DocStatus.PENDING.is(status)
                        && !actionOn.isEmpty()
                        && actionOn.compareTo(WINDOW_START) >= 0
                        && actionOn.compareTo(REF_DATE) <= 0) {
                    String cm = DateUtil.firstOfMonth(actionOn);
                    Bucket b = getBucket(buckets, cm, rec);
                    b.processed++;
                    AgeBands.increment(b.tat, DateUtil.daysBetween(uploadedOn, actionOn));
                    ApproverCount ac = b.perApprover.computeIfAbsent(approvedBy, k -> new ApproverCount());
                    if (DocStatus.ACCEPTED.is(status)) ac.accepted++; else ac.rejected++;
                }
                // pendingDocuments - walk every cal_month; snapshot = monthEnd(cm).
                for (String cm : calMonths) {
                    String asOf = monthEnd.get(cm);
                    if (asOf.compareTo(uploadedOn) < 0) continue;
                    boolean stillOpen = DocStatus.PENDING.is(status)
                            || (!actionOn.isEmpty() && asOf.compareTo(actionOn) < 0);
                    if (stillOpen) {
                        Bucket pb = getBucket(buckets, cm, rec);
                        pb.pending++;
                        AgeBands.increment(pb.ageing, DateUtil.daysBetween(uploadedOn, monthEnd.get(cm)));
                    }
                }
            }
        });

        List<Bucket> rows = new ArrayList<>();
        for (Bucket b : buckets.values()) {
            if (b.pending + b.submitted + b.processed > 0) rows.add(b);
        }
        rows.sort(Comparator
                .comparing((Bucket b) -> b.divisionName)
                .thenComparing(b -> b.branchCode)
                .thenComparing(b -> b.calMonth));

        List<Map<String, Object>> out = new ArrayList<>(rows.size());
        for (int i = 0; i < rows.size(); i++) {
            Bucket b = rows.get(i);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", i + 1);
            row.put("branchCode", b.branchCode);
            row.put("branchName", b.branchName);
            row.put("divisionName", b.divisionName);
            row.put("doCode", b.doCode);
            row.put("zone", b.zone);
            row.put("calMonth", b.calMonth);
            row.put("pendingDocuments", b.pending);
            row.put("submittedDocuments", b.submitted);
            row.put("processedDocuments", b.processed);
            row.put("ageingSummary", AgeBands.toMap(b.ageing));
            row.put("tatPerformance", AgeBands.toMap(b.tat));
            List<Map<String, Object>> perApp = new ArrayList<>();
            for (Map.Entry<String, ApproverCount> e : new TreeMap<>(b.perApprover).entrySet()) {
                Map<String, Object> ap = new LinkedHashMap<>();
                ap.put("approvedBy", e.getKey());
                ap.put("accepted", e.getValue().accepted);
                ap.put("rejected", e.getValue().rejected);
                perApp.add(ap);
            }
            row.put("perApprover", perApp);
            out.add(row);
        }

        Stage1BranchExtractor.writePrettyJsonArray(outPath, out);
        log.info("Wrote {}", outPath);
        log.info("  REF_DATE={} window=[{} .. {}]", REF_DATE, WINDOW_START, REF_DATE);
        log.info("  WINDOW_MONTHS={} calMonths: {} .. {}",
                WINDOW_MONTHS, calMonths.get(0), calMonths.get(calMonths.size() - 1));
        log.info("  sourceRecords={} (no case-selection filter - all cases considered)", stats[0]);
        log.info("  outputRows={}", out.size());
    }

    private static Bucket getBucket(Map<String, Bucket> buckets, String calMonth, JsonNode rec) {
        String branchCode = text(rec, "branchCode");
        String key = calMonth + "||" + branchCode;
        return buckets.computeIfAbsent(key, k -> {
            Bucket b = new Bucket();
            b.calMonth = calMonth;
            b.branchCode = branchCode;
            b.branchName = text(rec, "branchName");
            b.divisionName = text(rec, "divisionName");
            b.doCode = text(rec, "doCode");
            b.zone = text(rec, "zone");
            return b;
        });
    }

    private static String text(JsonNode n, String field) {
        JsonNode v = (n == null) ? null : n.get(field);
        return (v == null || v.isNull()) ? "" : v.asText();
    }

    private static final class Bucket {
        String calMonth, branchCode, branchName, divisionName, doCode, zone;
        int pending, submitted, processed;
        int[] ageing = AgeBands.create();
        int[] tat = AgeBands.create();
        Map<String, ApproverCount> perApprover = new LinkedHashMap<>();
    }

    private static final class ApproverCount { int accepted; int rejected; }
}
