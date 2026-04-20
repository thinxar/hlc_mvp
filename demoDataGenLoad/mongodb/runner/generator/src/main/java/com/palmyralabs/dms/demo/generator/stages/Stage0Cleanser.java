package com.palmyralabs.dms.demo.generator.stages;

import com.palmyralabs.dms.demo.generator.PipelineContext;
import com.palmyralabs.dms.demo.generator.util.CsvUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Stage 0: cleanse base_data/branch.csv into generated/branch.csv.
 *
 * <p>Implements {@code specs/cleansing/branch_cleansing_spec.txt} and
 * {@code scripts/cleansing/cleanse_branch_csv.js} rule-for-rule:
 * whitespace normalization, division-name alias merging, doCode sequencing
 * rooted at 201 per canonical division in (Zone, Division) order.
 */
@Slf4j
@Component
public class Stage0Cleanser {

    public void run(PipelineContext ctx) throws IOException {
        Path srcPath = ctx.getBaseDataDir().resolve("branch.csv");
        Path outPath = ctx.branchCsvPath();

        String text = Files.readString(srcPath, StandardCharsets.UTF_8);
        List<List<String>> rows = CsvUtil.parse(text);
        if (rows.isEmpty()) throw new IllegalStateException("branch.csv is empty: " + srcPath);

        // Header
        List<String> rawHeader = new ArrayList<>();
        for (String cell : rows.remove(0)) rawHeader.add(CsvUtil.cleanWs(cell));
        int iZone  = rawHeader.indexOf("Zone");
        int iDiv   = rawHeader.indexOf("Division Name");
        int iCode  = rawHeader.indexOf("Branch Code");
        int iName  = rawHeader.indexOf("Branch Name");
        int iCases = rawHeader.indexOf("Number of Cases");
        int iDocs  = rawHeader.indexOf("Documents");
        if (iZone < 0 || iDiv < 0 || iCode < 0 || iName < 0 || iCases < 0 || iDocs < 0) {
            throw new IllegalStateException("branch.csv missing required columns. Found: " + rawHeader);
        }

        // Pass 1: parse + build alias groups
        // canonKey -> { spellings: LinkedHashMap<display, count>, rowIndexes }
        Map<String, Group> groups = new LinkedHashMap<>();
        List<Rec> parsed = new ArrayList<>();

        for (List<String> raw : rows) {
            Rec rec = new Rec();
            rec.zone   = CsvUtil.cleanWs(get(raw, iZone));
            rec.divRaw = CsvUtil.cleanWs(get(raw, iDiv));
            rec.code   = CsvUtil.cleanWs(get(raw, iCode));
            rec.name   = CsvUtil.cleanWs(get(raw, iName));
            rec.cases  = CsvUtil.cleanWs(get(raw, iCases));
            rec.docs   = CsvUtil.cleanWs(get(raw, iDocs));
            if (rec.code.isEmpty()) continue;

            String key = CsvUtil.canon(rec.divRaw);
            if (key.isEmpty()) continue;

            Group g = groups.get(key);
            if (g == null) { g = new Group(); groups.put(key, g); }
            g.spellings.merge(rec.divRaw, 1, Integer::sum);
            g.rowIndexes.add(parsed.size());
            parsed.add(rec);
        }

        // Resolve canonical display per group (rule 3 tie-break ladder)
        Map<String, String> canonicalDisplay = new HashMap<>();
        for (Map.Entry<String, Group> e : groups.entrySet()) {
            Group g = e.getValue();
            List<Map.Entry<String, Integer>> spellings = new ArrayList<>(g.spellings.entrySet());
            // step 1: entries whose display equals canon(display) (i.e. no interior non-alphanum)
            List<Map.Entry<String, Integer>> clean = new ArrayList<>();
            for (Map.Entry<String, Integer> s : spellings) {
                if (s.getKey().equals(stripNonAlnum(s.getKey()))) clean.add(s);
            }
            String chosen;
            if (clean.size() == 1) {
                chosen = clean.get(0).getKey();
            } else {
                List<Map.Entry<String, Integer>> pool = clean.size() > 1 ? clean : spellings;
                pool.sort((a, b) -> {
                    int cmp = Integer.compare(b.getValue(), a.getValue());
                    return cmp != 0 ? cmp : a.getKey().compareTo(b.getKey());
                });
                chosen = pool.get(0).getKey();
            }
            canonicalDisplay.put(e.getKey(), chosen);
        }

        // Log alias merges to stderr (rule 3 / rule 8).
        for (Map.Entry<String, Group> e : groups.entrySet()) {
            Group g = e.getValue();
            if (g.spellings.size() < 2) continue;
            String chosen = canonicalDisplay.get(e.getKey());
            List<Map.Entry<String, Integer>> sorted = new ArrayList<>(g.spellings.entrySet());
            sorted.sort((a, b) -> {
                int cmp = Integer.compare(b.getValue(), a.getValue());
                return cmp != 0 ? cmp : a.getKey().compareTo(b.getKey());
            });
            StringBuilder sb = new StringBuilder("alias merge: ");
            for (int i = 0; i < sorted.size(); i++) {
                Map.Entry<String, Integer> s = sorted.get(i);
                if (i > 0) sb.append(" + ");
                sb.append('"').append(s.getKey()).append("\" (").append(s.getValue())
                        .append(" row").append(s.getValue() == 1 ? "" : "s").append(')');
            }
            sb.append(" -> \"").append(chosen).append('"');
            System.err.println(sb);
        }

        // doCode assignment (rule 4): every canonical division appears under exactly one Zone.
        Map<String, String> zoneByDivision = new LinkedHashMap<>();
        for (Rec rec : parsed) {
            String div = canonicalDisplay.get(CsvUtil.canon(rec.divRaw));
            String existing = zoneByDivision.get(div);
            if (existing == null) {
                zoneByDivision.put(div, rec.zone);
            } else if (!existing.equals(rec.zone)) {
                throw new IllegalStateException("Canonical division \"" + div
                        + "\" appears under multiple zones: \"" + existing + "\" and \"" + rec.zone + "\".");
            }
        }
        // Order by Zone ASC, Division Name ASC.
        List<Map.Entry<String, String>> canonicalOrdered = new ArrayList<>(zoneByDivision.entrySet());
        canonicalOrdered.sort((a, b) -> {
            int cmp = a.getValue().compareTo(b.getValue());      // Zone
            return cmp != 0 ? cmp : a.getKey().compareTo(b.getKey()); // Division
        });
        Map<String, String> doCodeOf = new HashMap<>();
        for (int i = 0; i < canonicalOrdered.size(); i++) {
            int seq = 201 + i;
            doCodeOf.put(canonicalOrdered.get(i).getKey(), Integer.toString(seq));
        }
        int distinctDivisions = canonicalOrdered.size();

        // Build output rows (rule 5 sort).
        int merged = 0;
        List<OutRow> outRows = new ArrayList<>(parsed.size());
        for (Rec rec : parsed) {
            String canonKey = CsvUtil.canon(rec.divRaw);
            String canonicalDiv = canonicalDisplay.get(canonKey);
            if (!canonicalDiv.equals(rec.divRaw)) merged++;
            OutRow r = new OutRow();
            r.zone     = rec.zone;
            r.division = canonicalDiv;
            r.doCode   = doCodeOf.get(canonicalDiv);
            r.code     = rec.code;
            r.name     = rec.name;
            r.cases    = rec.cases;
            r.docs     = rec.docs;
            outRows.add(r);
        }
        outRows.sort(Comparator
                .comparing((OutRow r) -> r.zone)
                .thenComparing(r -> r.division)
                .thenComparing(r -> r.code));

        // Write CSV.
        Files.createDirectories(outPath.getParent());
        StringBuilder sb = new StringBuilder(64 * 1024);
        String[] header = { "Zone", "Division Name", "doCode", "Branch Code", "Branch Name", "Number of Cases", "Documents" };
        appendJoined(sb, Arrays.stream(header).map(CsvUtil::cell).toArray(String[]::new));
        sb.append('\n');
        for (OutRow r : outRows) {
            appendJoined(sb,
                    CsvUtil.cell(r.zone),
                    CsvUtil.cell(r.division),
                    CsvUtil.cell(r.doCode),
                    CsvUtil.cell(r.code),
                    CsvUtil.cell(r.name),
                    CsvUtil.cell(r.cases),
                    CsvUtil.cell(r.docs));
            sb.append('\n');
        }
        Files.writeString(outPath, sb.toString(), StandardCharsets.UTF_8);

        // Stdout log (rule 8); forward-slash path to match the fixed behaviour called out in the task.
        String logRel = "generated/branch.csv";
        log.info("wrote {}: rows={} branches={} divisions={} merged={}",
                logRel, outRows.size(), outRows.size(), distinctDivisions, merged);
    }

    private static void appendJoined(StringBuilder sb, String... parts) {
        for (int i = 0; i < parts.length; i++) {
            if (i > 0) sb.append(',');
            sb.append(parts[i]);
        }
    }

    private static String get(List<String> row, int idx) {
        return (idx >= 0 && idx < row.size()) ? row.get(idx) : "";
    }

    /** Strip anything non-[A-Za-z0-9]; preserves case (used for rule-3 step-1 test). */
    private static String stripNonAlnum(String s) {
        StringBuilder sb = new StringBuilder(s.length());
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) sb.append(c);
        }
        return sb.toString();
    }

    private static final class Group {
        final LinkedHashMap<String, Integer> spellings = new LinkedHashMap<>();
        final List<Integer> rowIndexes = new ArrayList<>();
    }

    private static final class Rec {
        String zone, divRaw, code, name, cases, docs;
    }

    private static final class OutRow {
        String zone, division, doCode, code, name, cases, docs;
    }
}
