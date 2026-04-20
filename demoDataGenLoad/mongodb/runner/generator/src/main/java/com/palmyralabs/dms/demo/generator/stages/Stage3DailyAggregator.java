package com.palmyralabs.dms.demo.generator.stages;

import com.fasterxml.jackson.databind.JsonNode;
import com.palmyralabs.dms.demo.generator.PipelineContext;
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
 * Stage 3: daily aggregator. Emits one row per (cal_date, branchCode) over
 * the last {@code WINDOW_DAYS} calendar days ending at REF_DATE, per
 * {@code specs/aggregation/active_cases_daily_agg_spec.txt}.
 */
@Slf4j
@Component
public class Stage3DailyAggregator {

    private static final int WINDOW_DAYS = 90;

    public void run(PipelineContext ctx) throws IOException {
        Path inPath = ctx.allCasesPath();
        Path outPath = ctx.getDataDir().resolve("active_cases_branchwise.json");
        String REF_DATE = ctx.getReportToday();
        String WINDOW_START = DateUtil.addDays(REF_DATE, -(WINDOW_DAYS - 1));
        String ARM_A_START  = DateUtil.addDays(REF_DATE, -(WINDOW_DAYS + 89));

        List<String> calDates = new ArrayList<>(WINDOW_DAYS);
        for (int i = WINDOW_DAYS - 1; i >= 0; i--) calDates.add(DateUtil.addDays(REF_DATE, -i));

        Map<String, Bucket> buckets = new LinkedHashMap<>();
        int[] stats = { 0, 0, 0, 0 };  // lines, selected, armA, armB

        Stage3Common.streamJsonl(inPath, rec -> {
            stats[0]++;
            boolean hasPending = false;
            boolean hasRecentAction = false;
            JsonNode docs = rec.get("documents");
            if (docs != null && docs.isArray()) {
                for (JsonNode d : docs) {
                    String status = text(d, "status");
                    String actionOn = text(d, "actionOn");
                    if ("pending".equals(status)) hasPending = true;
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
                // submittedDocuments (single cal_date = uploadedOn)
                if (uploadedOn.compareTo(WINDOW_START) >= 0 && uploadedOn.compareTo(REF_DATE) <= 0) {
                    getBucket(buckets, uploadedOn, rec).submitted++;
                }
                // processedDocuments + perApprover (single cal_date = actionOn)
                if (!"pending".equals(status)
                        && !actionOn.isEmpty()
                        && actionOn.compareTo(WINDOW_START) >= 0
                        && actionOn.compareTo(REF_DATE) <= 0) {
                    Bucket b = getBucket(buckets, actionOn, rec);
                    b.processed++;
                    ApproverCount ac = b.perApprover.computeIfAbsent(approvedBy, k -> new ApproverCount());
                    if ("accepted".equals(status)) ac.accepted++; else ac.rejected++;
                }
                // pendingDocuments - walk every cal_date in window
                for (String calDate : calDates) {
                    if (calDate.compareTo(uploadedOn) < 0) continue;
                    boolean stillOpen = "pending".equals(status)
                            || (!actionOn.isEmpty() && calDate.compareTo(actionOn) < 0);
                    if (stillOpen) getBucket(buckets, calDate, rec).pending++;
                }
            }
        });

        // Materialize: drop all-zero, sort, assign id.
        List<Bucket> rows = new ArrayList<>();
        for (Bucket b : buckets.values()) {
            if (b.pending + b.submitted + b.processed > 0) rows.add(b);
        }
        rows.sort(Comparator
                .comparing((Bucket b) -> b.divisionName)
                .thenComparing(b -> b.branchCode)
                .thenComparing(b -> b.calDate));

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
            row.put("calDate", b.calDate);
            row.put("pendingDocuments", b.pending);
            row.put("submittedDocuments", b.submitted);
            row.put("processedDocuments", b.processed);
            List<Map<String, Object>> perApp = new ArrayList<>(b.perApprover.size());
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
        log.info("  sourceRecords={} selectedCases={} (armA={} armB={})",
                stats[0], stats[1], stats[2], stats[3]);
        log.info("  outputRows={}", out.size());
    }

    private static Bucket getBucket(Map<String, Bucket> buckets, String calDate, JsonNode rec) {
        String branchCode = text(rec, "branchCode");
        String key = calDate + "||" + branchCode;
        return buckets.computeIfAbsent(key, k -> {
            Bucket b = new Bucket();
            b.calDate = calDate;
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
        String calDate, branchCode, branchName, divisionName, doCode, zone;
        int pending, submitted, processed;
        Map<String, ApproverCount> perApprover = new LinkedHashMap<>();
    }

    private static final class ApproverCount {
        int accepted;
        int rejected;
    }
}
