package com.palmyralabs.dms.demo.generator.stages;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
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
 * Stage 1: extract unique branch reference data from the cleansed
 * {@code generated/branch.csv}. Output: {@code generated/branches.json},
 * a pretty JSON array (2-space indent, trailing newline) sorted by
 * (zone, divisionName, branchCode).
 */
@Slf4j
@Component
public class Stage1BranchExtractor {

    public void run(PipelineContext ctx) throws IOException {
        Path csvPath = ctx.branchCsvPath();
        Path outPath = ctx.getDataDir().resolve("branches.json");

        String text = Files.readString(csvPath, StandardCharsets.UTF_8);
        List<List<String>> rows = CsvUtil.parse(text);
        if (rows.isEmpty()) throw new IllegalStateException("branch.csv is empty: " + csvPath);

        List<String> header = new ArrayList<>();
        for (String h : rows.remove(0)) header.add(CsvUtil.cleanWs(h));
        int iZone = header.indexOf("Zone");
        int iDiv = header.indexOf("Division Name");
        int iDoCode = header.indexOf("doCode");
        int iCode = header.indexOf("Branch Code");
        int iName = header.indexOf("Branch Name");
        if (iZone < 0 || iDiv < 0 || iDoCode < 0 || iCode < 0 || iName < 0) {
            throw new IllegalStateException("branch.csv missing required columns (did cleansing run?). Found: " + header);
        }

        LinkedHashMap<String, Map<String, String>> byCode = new LinkedHashMap<>();
        int duplicates = 0, skippedBlank = 0;

        for (List<String> raw : rows) {
            String zone         = CsvUtil.cleanWs(get(raw, iZone));
            String divisionName = CsvUtil.cleanWs(get(raw, iDiv));
            String doCode       = CsvUtil.cleanWs(get(raw, iDoCode));
            String branchCode   = CsvUtil.cleanWs(get(raw, iCode));
            String branchName   = CsvUtil.cleanWs(get(raw, iName));
            if (branchCode.isEmpty()) { skippedBlank++; continue; }

            Map<String, String> prior = byCode.get(branchCode);
            if (prior != null) {
                if (!prior.get("zone").equals(zone)
                        || !prior.get("divisionName").equals(divisionName)
                        || !prior.get("doCode").equals(doCode)
                        || !prior.get("branchName").equals(branchName)) {
                    throw new IllegalStateException(
                            "Conflicting duplicate branchCode \"" + branchCode + "\": first=" + prior
                                    + " vs next=zone=" + zone + ",divisionName=" + divisionName
                                    + ",doCode=" + doCode + ",branchName=" + branchName);
                }
                System.err.println("duplicate branchCode \"" + branchCode + "\" - keeping first occurrence");
                duplicates++;
                continue;
            }
            Map<String, String> rec = new LinkedHashMap<>();
            rec.put("zone", zone);
            rec.put("divisionName", divisionName);
            rec.put("doCode", doCode);
            rec.put("branchCode", branchCode);
            rec.put("branchName", branchName);
            byCode.put(branchCode, rec);
        }

        // Sort by (zone, divisionName, branchCode).
        List<Map<String, String>> out = new ArrayList<>(byCode.values());
        out.sort((a, b) -> {
            int c = a.get("zone").compareTo(b.get("zone"));
            if (c != 0) return c;
            c = a.get("divisionName").compareTo(b.get("divisionName"));
            if (c != 0) return c;
            return a.get("branchCode").compareTo(b.get("branchCode"));
        });

        Files.createDirectories(outPath.getParent());
        writePrettyJsonArray(outPath, out);

        log.info("wrote {} branches to generated/branches.json (duplicates={}, blankCode={})",
                out.size(), duplicates, skippedBlank);
    }

    private static String get(List<String> row, int idx) {
        return (idx >= 0 && idx < row.size()) ? row.get(idx) : "";
    }

    /** Write a pretty (2-space indent) JSON array plus trailing newline. */
    static void writePrettyJsonArray(Path path, Object data) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        // Jackson default indent is 2 spaces with DefaultPrettyPrinter; good enough.
        byte[] body = mapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(data);
        try (var os = Files.newOutputStream(path)) {
            os.write(body);
            os.write((byte) '\n');
        }
    }
}
