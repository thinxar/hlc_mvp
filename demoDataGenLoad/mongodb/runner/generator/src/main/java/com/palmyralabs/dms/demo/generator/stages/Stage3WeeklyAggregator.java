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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Stage 3: weekly aggregator (WINDOW_WEEKS rolling 7-day periods ending
 * at REF_DATE). Each cal_week is the LAST day of a rolling 7-day period.
 * Matches {@code specs/aggregation/active_cases_weekly_agg_spec.txt}.
 */
@Slf4j
@Component
public class Stage3WeeklyAggregator {

    private static final int WINDOW_WEEKS = 52;
    private static final int WEEK_DAYS = 7;

    public void run(PipelineContext ctx) throws IOException {
        Path inPath = ctx.allCasesPath();
        Path outPath = ctx.getDataDir().resolve("active_cases_weekly_branchwise.json");
        String REF_DATE = ctx.getReportToday();
        String WINDOW_START = DateUtil.addDays(REF_DATE, -(WEEK_DAYS * WINDOW_WEEKS - 1));
        String ARM_A_START  = DateUtil.addDays(REF_DATE, -(WEEK_DAYS * WINDOW_WEEKS + 89));

        List<String> calWeeks = new ArrayList<>(WINDOW_WEEKS);
        for (int k = WINDOW_WEEKS - 1; k >= 0; k--) {
            calWeeks.add(DateUtil.addDays(REF_DATE, -WEEK_DAYS * k));
        }

        Map<String, Bucket> buckets = new LinkedHashMap<>();
        int[] stats = { 0, 0, 0, 0 };  // lines, selected, armA, armB

        Stage3Common.streamJsonl(inPath, rec -> {
            stats[0]++;
            boolean hasPending = false, hasRecentAction = false;
            JsonNode docs = rec.get("documents");
            if (docs != null && docs.isArray()) {
                for (JsonNode d : docs) {
                    String status = text(d, "status");
                    String actionOn = text(d, "actionOn");
                    if (DocStatus.PENDING.is(status)) hasPending = true;
                    if (!actionOn.isEmpty()
                            && actionOn.compareTo(WINDOW_START) >= 0
                            && actionOn.compareTo(REF_DATE) <= 0) hasRecentAction = true;
                    if (hasPending && hasRecentAction) break;
                }
            }
            String requestDate = text(rec, "requestDate");
            boolean armA = requestDate.compareTo(ARM_A_START) >= 0
                    && requestDate.compareTo(REF_DATE) <= 0
                    && hasPending;
            boolean armB = hasRecentAction;
            if (!armA && !armB) return;
            stats[1]++;
            if (armA) stats[2]++;
            if (armB) stats[3]++;

            if (docs == null || !docs.isArray()) return;
            for (JsonNode d : docs) {
                String status = text(d, "status");
                String uploadedOn = text(d, "uploadedOn");
                String actionOn = text(d, "actionOn");
                String approvedBy = text(d, "approvedBy");

                // submittedDocuments (cal_week containing uploadedOn).
                if (uploadedOn.compareTo(WINDOW_START) >= 0 && uploadedOn.compareTo(REF_DATE) <= 0) {
                    String cw = calWeekFor(uploadedOn, REF_DATE);
                    if (cw != null) getBucket(buckets, cw, rec).submitted++;
                }
                // processedDocuments + perApprover.
                if (!DocStatus.PENDING.is(status)
                        && !actionOn.isEmpty()
                        && actionOn.compareTo(WINDOW_START) >= 0
                        && actionOn.compareTo(REF_DATE) <= 0) {
                    String cw = calWeekFor(actionOn, REF_DATE);
                    if (cw != null) {
                        Bucket b = getBucket(buckets, cw, rec);
                        b.processed++;
                        AgeBands.increment(b.tat, DateUtil.daysBetween(uploadedOn, actionOn));
                        ApproverCount ac = b.perApprover.computeIfAbsent(approvedBy, k -> new ApproverCount());
                        if (DocStatus.ACCEPTED.is(status)) ac.accepted++; else ac.rejected++;
                    }
                }
                // pendingDocuments - walk every cal_week.
                for (String cw : calWeeks) {
                    if (cw.compareTo(uploadedOn) < 0) continue;
                    boolean stillOpen = DocStatus.PENDING.is(status)
                            || (!actionOn.isEmpty() && cw.compareTo(actionOn) < 0);
                    if (stillOpen) {
                        Bucket pb = getBucket(buckets, cw, rec);
                        pb.pending++;
                        AgeBands.increment(pb.ageing, DateUtil.daysBetween(uploadedOn, cw));
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
                .thenComparing(b -> b.calWeek));

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
            row.put("calWeek", b.calWeek);
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
        log.info("  REF_DATE={} window=[{} .. {}] armAStart={}",
                REF_DATE, WINDOW_START, REF_DATE, ARM_A_START);
        log.info("  WINDOW_WEEKS={} calWeeks={}", WINDOW_WEEKS, String.join(", ", calWeeks));
        log.info("  sourceRecords={} selectedCases={} (armA={} armB={})",
                stats[0], stats[1], stats[2], stats[3]);
        log.info("  outputRows={}", out.size());
    }

    /** Map an in-window actionOn / uploadedOn to its cal_week end-date. */
    private static String calWeekFor(String iso, String refDate) {
        int x = DateUtil.daysBetween(iso, refDate);   // refDate - iso
        if (x < 0 || x > WEEK_DAYS * WINDOW_WEEKS - 1) return null;
        int k = x / WEEK_DAYS;
        return DateUtil.addDays(refDate, -WEEK_DAYS * k);
    }

    private static Bucket getBucket(Map<String, Bucket> buckets, String calWeek, JsonNode rec) {
        String branchCode = text(rec, "branchCode");
        String key = calWeek + "||" + branchCode;
        return buckets.computeIfAbsent(key, k -> {
            Bucket b = new Bucket();
            b.calWeek = calWeek;
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
        String calWeek, branchCode, branchName, divisionName, doCode, zone;
        int pending, submitted, processed;
        int[] ageing = AgeBands.create();
        int[] tat = AgeBands.create();
        Map<String, ApproverCount> perApprover = new LinkedHashMap<>();
    }

    private static final class ApproverCount { int accepted; int rejected; }
}
