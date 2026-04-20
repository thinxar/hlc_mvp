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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Stage 1: extract unique (zone, divisionName) pairs from the cleansed
 * branch.csv. Output: {@code generated/zone_divisions.json}.
 */
@Slf4j
@Component
public class Stage1ZoneDivisionExtractor {

    public void run(PipelineContext ctx) throws IOException {
        Path csvPath = ctx.branchCsvPath();
        Path outPath = ctx.getDataDir().resolve("zone_divisions.json");

        String text = Files.readString(csvPath, StandardCharsets.UTF_8);
        List<List<String>> rows = CsvUtil.parse(text);
        if (rows.isEmpty()) throw new IllegalStateException("branch.csv is empty: " + csvPath);

        List<String> header = new ArrayList<>();
        for (String h : rows.remove(0)) header.add(CsvUtil.cleanWs(h));
        int iZone = header.indexOf("Zone");
        int iDiv = header.indexOf("Division Name");
        int iDoCode = header.indexOf("doCode");
        if (iZone < 0 || iDiv < 0 || iDoCode < 0) {
            throw new IllegalStateException("branch.csv missing required columns (did cleansing run?). Found: " + header);
        }

        LinkedHashMap<String, Map<String, String>> seen = new LinkedHashMap<>();
        int skippedBlank = 0;

        for (int r = 0; r < rows.size(); r++) {
            List<String> raw = rows.get(r);
            String zone = CsvUtil.cleanWs(get(raw, iZone));
            String divisionName = CsvUtil.cleanWs(get(raw, iDiv));
            String doCode = CsvUtil.cleanWs(get(raw, iDoCode));
            int sourceLine = r + 2;

            if (zone.isEmpty() && divisionName.isEmpty()) { skippedBlank++; continue; }
            if (zone.isEmpty() || divisionName.isEmpty()) {
                throw new IllegalStateException("Row " + sourceLine
                        + ": partial zone/divisionName (zone=\"" + zone + "\", divisionName=\"" + divisionName + "\")");
            }

            String key = zone + "\u0000" + divisionName;
            Map<String, String> prior = seen.get(key);
            if (prior == null) {
                Map<String, String> rec = new LinkedHashMap<>();
                rec.put("zone", zone);
                rec.put("divisionName", divisionName);
                rec.put("doCode", doCode);
                seen.put(key, rec);
            } else if (!prior.get("doCode").equals(doCode)) {
                throw new IllegalStateException("Row " + sourceLine + ": conflicting doCode for ("
                        + zone + ", " + divisionName + "): \"" + prior.get("doCode") + "\" vs \"" + doCode + "\"");
            }
        }

        List<Map<String, String>> out = new ArrayList<>(seen.values());
        out.sort((a, b) -> {
            int c = a.get("zone").compareTo(b.get("zone"));
            return c != 0 ? c : a.get("divisionName").compareTo(b.get("divisionName"));
        });

        Files.createDirectories(outPath.getParent());
        Stage1BranchExtractor.writePrettyJsonArray(outPath, out);

        log.info("wrote {} zone/division pairs to generated/zone_divisions.json (blankRows={})",
                out.size(), skippedBlank);
    }

    private static String get(List<String> row, int idx) {
        return (idx >= 0 && idx < row.size()) ? row.get(idx) : "";
    }
}
