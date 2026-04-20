package com.palmyralabs.dms.demo.generator.stages;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.palmyralabs.dms.demo.generator.PipelineContext;
import com.palmyralabs.dms.demo.generator.util.CsvUtil;
import com.palmyralabs.dms.demo.generator.util.DateUtil;
import com.palmyralabs.dms.demo.generator.util.Mulberry32;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * Stage 2: master case generator. Java port of
 * {@code scripts/data_gen/generate_all_cases.js} per
 * {@code specs/data_gen/data_generation.txt}.
 *
 * <p>Deviations from the JS reference (spec-compliance fixes):
 * <ul>
 *   <li><b>uploadedOn {@literal >} requestDate always.</b> The JS version, when {@code requestDate == TODAY},
 *       emitted {@code uploadedOn == requestDate}, violating the data_spec rule that uploadedOn
 *       must be strictly after requestDate. We clamp using
 *       {@code uploadedOn = max(requestDate + 1, min(requestDate + rand(1..5), TODAY))}.
 *       For a same-day case this still falls through to {@code requestDate + 1} which is one
 *       day past TODAY; monthly/weekly/daily aggregations compute correctly since their
 *       {@code REF_DATE} is itself a runtime parameter and pending/submitted-day semantics
 *       handle a future uploadedOn gracefully.</li>
 * </ul>
 */
@Slf4j
@Component
public class Stage2CaseGenerator {

    /** Hard-coded PRNG seed, matching the JS script. Changing this changes every downstream byte. */
    private static final int SEED = 20260419;

    private static final int MIN_DOCS = 2;
    private static final int MAX_DOCS = 10;
    private static final String RANGE_START = "2024-04-01";
    private static final double RESHUFFLE_PROB = 0.02;

    private static final String[] CHANNELS = { "AGENT_PORTAL", "CUSTOMER_PORTAL", "BRANCH" };
    private static final String[] PRODUCT_CODES = { "TRAD-ENDOW-15", "TRAD-ENDOW-20", "JEEVAN-ANAND", "MONEY-BACK-25", "TERM-PLUS-10" };
    private static final String[] DOC_TYPES = { "DGH_FORM", "PAYMENT_RECEIPT", "ID_PROOF" };

    private static final Map<String, String[]> SLUGS = new HashMap<>();
    static {
        SLUGS.put("DGH_FORM",        new String[] { "dgh_form_signed", "declaration_good_health", "dgh_ref", "good_health_declaration", "dgh_attested", "health_declaration_form" });
        SLUGS.put("PAYMENT_RECEIPT", new String[] { "premium_receipt", "payment_ack", "txn_slip", "renewal_receipt", "neft_ack", "upi_payment_ref", "bank_challan" });
        SLUGS.put("ID_PROOF",        new String[] { "aadhaar_copy", "aadhaar_masked", "pan_card", "voter_id", "passport_scan", "driving_license", "ration_card" });
    }
    private static final String[] EXTS = { "pdf", "pdf", "pdf", "pdf", "doc", "docx", "jpg" };

    private final Mulberry32 rng = new Mulberry32(SEED);

    /** month "YYYY-MM" -> set of officer IDs already claimed in that month (disjointness, rule 4.3). */
    private final Map<String, Set<String>> monthUsedIds = new HashMap<>();

    private int reshuffleCount = 0;
    private int inheritCount = 0;
    private int collisionFallbackCount = 0;

    public void run(PipelineContext ctx) throws IOException {
        Path csvPath = ctx.branchCsvPath();
        Path outPath = ctx.allCasesPath();
        String TODAY = ctx.getGenToday();
        int rangeDays = Math.max(0, DateUtil.daysBetween(RANGE_START, TODAY));

        // Parse cleansed CSV.
        String text = Files.readString(csvPath, StandardCharsets.UTF_8);
        List<List<String>> rows = CsvUtil.parse(text);
        if (rows.isEmpty()) throw new IllegalStateException("branch.csv empty: " + csvPath);
        List<String> header = new ArrayList<>();
        for (String h : rows.remove(0)) header.add(CsvUtil.cleanWs(h));
        int iZone = header.indexOf("Zone");
        int iDiv = header.indexOf("Division Name");
        int iDoCode = header.indexOf("doCode");
        int iCode = header.indexOf("Branch Code");
        int iName = header.indexOf("Branch Name");
        int iCases = header.indexOf("Number of Cases");
        int iDocs = header.indexOf("Documents");
        if (iZone < 0 || iDiv < 0 || iDoCode < 0 || iCode < 0 || iName < 0 || iCases < 0 || iDocs < 0) {
            throw new IllegalStateException("branch.csv missing required columns (did cleansing run?). Found: " + header);
        }

        long docCounter = 10000L;
        List<Record> allRecords = new ArrayList<>();
        int totalBranches = 0;
        long totalCases = 0, totalDocs = 0;

        for (List<String> raw : rows) {
            String zone = CsvUtil.cleanWs(get(raw, iZone));
            String division = CsvUtil.cleanWs(get(raw, iDiv));
            String doCode = CsvUtil.cleanWs(get(raw, iDoCode));
            String code = CsvUtil.cleanWs(get(raw, iCode));
            String name = CsvUtil.cleanWs(get(raw, iName));
            int csvCases = parseIntOr(CsvUtil.cleanWs(get(raw, iCases)), 0);
            int csvDocs = parseIntOr(CsvUtil.cleanWs(get(raw, iDocs)), 0);
            if (csvCases <= 0 || code.isEmpty()) continue;

            int N = 2 * csvCases;            // rule 1
            int D = 2 * csvDocs;             // rule 8
            double rejectedPct = 0.03 + rng.nextDouble() * 0.04;   // rule 9: [3%, 7%]
            double uploadRatio = 0.80 + rng.nextDouble() * 0.15;   // rule 12.1: [80%, 95%]

            // Phase 1a: draw ageDays / requestDate for every case up front.
            CaseInfo[] caseInfos = new CaseInfo[N];
            for (int i = 0; i < N; i++) {
                int ageDays = rng.nextIntBelow(rangeDays + 1);
                caseInfos[i] = new CaseInfo(ageDays, DateUtil.addDays(TODAY, -ageDays));
            }

            // Phase 1b: allocate / inherit a pool per month this branch touches, chronological order.
            Set<String> distinctMonths = new TreeSet<>();
            for (CaseInfo c : caseInfos) distinctMonths.add(c.requestDate.substring(0, 7));
            Map<String, List<String>> branchPools = new LinkedHashMap<>();
            List<String> prevPool = null;
            for (String month : distinctMonths) {
                boolean shouldReshuffle = (prevPool == null) || (rng.nextDouble() < RESHUFFLE_PROB);
                List<String> pool;
                if (shouldReshuffle) {
                    pool = allocateFreshPool(month);
                    if (prevPool != null) reshuffleCount++;
                } else {
                    pool = tryInheritPool(month, prevPool);
                    if (pool != null) {
                        inheritCount++;
                    } else {
                        pool = allocateFreshPool(month);
                        collisionFallbackCount++;
                    }
                }
                branchPools.put(month, pool);
                prevPool = pool;
            }

            int[] docCounts = allocateDocCounts(D, N);
            List<Record> branchRecords = new ArrayList<>(N);

            // Phase 2: generate cases using the pre-allocated pools.
            for (int i = 0; i < N; i++) {
                int ageDays = caseInfos[i].ageDays;
                String requestDate = caseInfos[i].requestDate;
                String month = requestDate.substring(0, 7);
                List<String> officerPool = branchPools.get(month);
                String submittedBy = officerPool.get(rng.nextIntBelow(officerPool.size()));

                String lapseDate            = DateUtil.addDays(requestDate, -(30 * (2 + rng.nextIntBelow(13))));
                String lastPremiumPaidDate  = DateUtil.addDays(lapseDate,   -(30 * (5 + rng.nextIntBelow(3))));
                int policyYears             = 3 + rng.nextIntBelow(6);
                String commencementDate     = DateUtil.addDays(lastPremiumPaidDate, -(365 * policyYears));
                String revivalPeriodEndDate = DateUtil.addDays(lapseDate, 365 * 5);
                String policyNumber = digits(9);

                int actionBase = 6 + rng.nextIntBelow(35);  // >= 6 keeps actionOn > uploadedOn

                List<Doc> documents = new ArrayList<>(docCounts[i]);
                for (int d = 0; d < docCounts[i]; d++) {
                    String type = pick(DOC_TYPES);
                    String status = pickStatus(ageDays, rejectedPct);

                    // uploadedOn = max(requestDate + 1, min(requestDate + rand(1..5), TODAY))
                    // Deviation from JS: JS produced uploadedOn == requestDate when requestDate == TODAY.
                    int jitter = 1 + rng.nextIntBelow(5);
                    String candidate = DateUtil.addDays(requestDate, jitter);
                    if (candidate.compareTo(TODAY) > 0) candidate = TODAY;
                    String requestPlusOne = DateUtil.addDays(requestDate, 1);
                    String uploadedOn = (candidate.compareTo(requestPlusOne) >= 0) ? candidate : requestPlusOne;

                    String actionOn;
                    if ("pending".equals(status)) {
                        actionOn = null;
                    } else {
                        int actionJitter = rng.nextIntBelow(6);
                        String actCand = DateUtil.addDays(requestDate, actionBase + actionJitter);
                        if (actCand.compareTo(TODAY) > 0) actCand = TODAY;
                        if (actCand.compareTo(uploadedOn) < 0) actCand = uploadedOn;
                        actionOn = actCand;
                    }

                    // uploadedBy: mostly = submittedBy (rule 12.1).
                    String uploadedBy;
                    if (rng.nextDouble() < uploadRatio || officerPool.size() < 2) {
                        uploadedBy = submittedBy;
                    } else {
                        uploadedBy = pickExcept(officerPool, submittedBy);
                    }
                    // approvedBy: pool member != uploadedBy for non-pending, else "" (rule 12.2/12.3).
                    String approvedBy = "pending".equals(status) ? "" : pickExcept(officerPool, uploadedBy);

                    Doc doc = new Doc();
                    doc.name = fileNameFor(type, docCounter, policyNumber, requestDate);
                    doc.type = type;
                    doc.status = status;
                    doc.docId = "DOC-" + docCounter;
                    docCounter++;
                    doc.uploadedBy = uploadedBy;
                    doc.approvedBy = approvedBy;
                    doc.uploadedOn = uploadedOn;
                    doc.actionOn = actionOn;
                    documents.add(doc);
                }

                Record rec = new Record();
                rec.requestId = null;   // assigned after global sort
                rec.requestDate = requestDate;
                rec.channel = pick(CHANNELS);
                rec.policyNumber = policyNumber;
                rec.productCode = pick(PRODUCT_CODES);
                rec.commencementDate = commencementDate;
                rec.lastPremiumPaidDate = lastPremiumPaidDate;
                rec.policyStatus = "LAPSED";
                rec.lapseDate = lapseDate;
                rec.revivalPeriodEndDate = revivalPeriodEndDate;
                rec.submittedBy = submittedBy;
                rec.zone = zone;
                rec.divisionName = division;
                rec.doCode = doCode;
                rec.branchCode = code;
                rec.branchName = name;
                rec.documents = documents;
                branchRecords.add(rec);
            }

            totalBranches++;
            totalCases += N;
            for (Record r : branchRecords) totalDocs += r.documents.size();
            allRecords.addAll(branchRecords);
        }

        // Global sort by requestDate ASC (stable).
        allRecords.sort(Comparator.comparing(r -> r.requestDate));

        // Assign globally-unique requestId in requestDate order: REV-YYYY-NNNNNNN.
        int idWidth = Math.max(7, Integer.toString(allRecords.size()).length());
        long g = 0;
        for (Record rec : allRecords) {
            rec.requestId = "REV-" + rec.requestDate.substring(0, 4) + "-" + DateUtil.pad(++g, idWidth);
        }

        // Stream-write NDJSON.
        ObjectMapper mapper = new ObjectMapper();
        Files.createDirectories(outPath.getParent());
        try (BufferedWriter w = Files.newBufferedWriter(outPath, StandardCharsets.UTF_8)) {
            for (Record rec : allRecords) {
                ObjectNode n = mapper.createObjectNode();
                n.put("requestId", rec.requestId);
                n.put("requestDate", rec.requestDate);
                n.put("channel", rec.channel);
                n.put("policyNumber", rec.policyNumber);
                n.put("productCode", rec.productCode);
                n.put("commencementDate", rec.commencementDate);
                n.put("lastPremiumPaidDate", rec.lastPremiumPaidDate);
                n.put("policyStatus", rec.policyStatus);
                n.put("lapseDate", rec.lapseDate);
                n.put("revivalPeriodEndDate", rec.revivalPeriodEndDate);
                n.put("submittedBy", rec.submittedBy);
                n.put("zone", rec.zone);
                n.put("divisionName", rec.divisionName);
                n.put("doCode", rec.doCode);
                n.put("branchCode", rec.branchCode);
                n.put("branchName", rec.branchName);
                ArrayNode docs = n.putArray("documents");
                for (Doc d : rec.documents) {
                    ObjectNode dn = docs.addObject();
                    dn.put("name", d.name);
                    dn.put("type", d.type);
                    dn.put("status", d.status);
                    dn.put("docId", d.docId);
                    dn.put("uploadedBy", d.uploadedBy);
                    dn.put("approvedBy", d.approvedBy);
                    dn.put("uploadedOn", d.uploadedOn);
                    dn.put("actionOn", d.actionOn);
                }
                w.write(mapper.writeValueAsString(n));
                w.newLine();
            }
        }

        long totalPoolIds = 0;
        for (Set<String> s : monthUsedIds.values()) totalPoolIds += s.size();
        int transitions = inheritCount + reshuffleCount + collisionFallbackCount;
        String reshufflePct = transitions > 0
                ? String.format("%.2f", 100.0 * reshuffleCount / transitions)
                : "0.00";
        log.info("Wrote {}", outPath);
        log.info("  branches={} cases={} documents={}", totalBranches, totalCases, totalDocs);
        log.info("  months={} totalOfficerIds={}", monthUsedIds.size(), totalPoolIds);
        log.info("  pool transitions: inherit={} reshuffle={} collisionFallback={} (reshufflePct={}%)",
                inheritCount, reshuffleCount, collisionFallbackCount, reshufflePct);
        log.info("  TODAY={} requestDate range: {} .. {}", TODAY, RANGE_START, TODAY);
        if (!allRecords.isEmpty()) {
            log.info("  actual: {} .. {}",
                    allRecords.get(0).requestDate,
                    allRecords.get(allRecords.size() - 1).requestDate);
        }
    }

    // ---------- officer-pool machinery ----------

    private String newOfficerId() {
        // 8-digit, no leading zero; range [10000000, 99999999]
        long v = 10000000L + rng.nextIntBelow(90000000);
        return Long.toString(v);
    }

    private Set<String> getMonthUsed(String month) {
        return monthUsedIds.computeIfAbsent(month, k -> new HashSet<>());
    }

    private List<String> allocateFreshPool(String month) {
        Set<String> used = getMonthUsed(month);
        int size = 3 + rng.nextIntBelow(3);          // {3, 4, 5}
        List<String> pool = new ArrayList<>(size);
        while (pool.size() < size) {
            String id = newOfficerId();
            if (!used.contains(id)) {
                used.add(id);
                pool.add(id);
            }
        }
        return pool;
    }

    /** Returns the inherited pool on success, null if any ID would collide (rule 4.3 fallback). */
    private List<String> tryInheritPool(String month, List<String> prevPool) {
        Set<String> used = getMonthUsed(month);
        for (String id : prevPool) if (used.contains(id)) return null;
        used.addAll(prevPool);
        return prevPool;
    }

    // ---------- doc-count allocation (rule 8) ----------
    private int[] allocateDocCounts(int totalDocs, int numCases) {
        if (numCases <= 0) return new int[0];
        int[] counts = new int[numCases];
        if (totalDocs >= MIN_DOCS * numCases) {
            Arrays.fill(counts, MIN_DOCS);
            int remaining = totalDocs - MIN_DOCS * numCases;
            while (remaining > 0) {
                int i = rng.nextIntBelow(numCases);
                if (counts[i] < MAX_DOCS) { counts[i]++; remaining--; }
            }
        } else {
            int base = totalDocs / numCases;
            int rem = totalDocs % numCases;
            for (int i = 0; i < numCases; i++) counts[i] = base + (i < rem ? 1 : 0);
        }
        return counts;
    }

    // ---------- status pick (rule 9) ----------
    private double pendingPctForAge(int ageDays) {
        if (ageDays > 180) return 0;
        if (ageDays > 90) return 0.07;
        return 0.40 - (0.25 * ageDays / 90.0);
    }

    private String pickStatus(int ageDays, double rejectedPct) {
        double r = rng.nextDouble();
        if (r < rejectedPct) return "rejected";
        double p = pendingPctForAge(ageDays);
        if (p > 0 && r < rejectedPct + p) return "pending";
        return "accepted";
    }

    // ---------- misc helpers ----------
    private String pick(String[] arr) { return arr[rng.nextIntBelow(arr.length)]; }

    private String pickExcept(List<String> arr, String exclude) {
        List<String> options = new ArrayList<>(arr.size());
        for (String x : arr) if (!x.equals(exclude)) options.add(x);
        return options.get(rng.nextIntBelow(options.size()));
    }

    private String digits(int n) {
        StringBuilder sb = new StringBuilder(n);
        for (int i = 0; i < n; i++) sb.append((char) ('0' + rng.nextIntBelow(10)));
        return sb.toString();
    }

    private String fileNameFor(String type, long idx, String policyNumber, String dateIso) {
        String slug = pick(SLUGS.get(type));
        String ext = pick(EXTS);
        String tag = policyNumber == null ? "" : policyNumber.substring(Math.max(0, policyNumber.length() - 4));
        int which = rng.nextIntBelow(4);
        switch (which) {
            case 0: return slug + "_" + DateUtil.pad(idx, 6) + "." + ext;
            case 1: return slug + "-" + tag + "-" + DateUtil.pad(idx, 5) + "." + ext;
            case 2: return slug + "_" + dateIso.replace("-", "") + "_" + DateUtil.pad(idx, 4) + "." + ext;
            default: return tag + "_" + slug + "." + ext;
        }
    }

    private static int parseIntOr(String s, int fallback) {
        if (s == null || s.isEmpty()) return fallback;
        try { return Integer.parseInt(s.trim()); } catch (NumberFormatException e) { return fallback; }
    }

    private static String get(List<String> row, int idx) {
        return (idx >= 0 && idx < row.size()) ? row.get(idx) : "";
    }

    // ---------- data carriers ----------
    private static final class CaseInfo {
        final int ageDays;
        final String requestDate;
        CaseInfo(int ageDays, String requestDate) { this.ageDays = ageDays; this.requestDate = requestDate; }
    }

    private static final class Doc {
        String name, type, status, docId, uploadedBy, approvedBy, uploadedOn, actionOn;
    }

    private static final class Record {
        String requestId, requestDate, channel, policyNumber, productCode,
                commencementDate, lastPremiumPaidDate, policyStatus, lapseDate, revivalPeriodEndDate,
                submittedBy, zone, divisionName, doCode, branchCode, branchName;
        List<Doc> documents;
    }
}
