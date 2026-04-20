package com.palmyralabs.dms.demo.generator;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.nio.file.Path;

/**
 * Carries resolved paths, dates, and skip flags across stages. Built once in
 * {@link PipelineRunner} and injected into each stage via its {@code run} method.
 */
@Getter
@RequiredArgsConstructor
public class PipelineContext {
    /** Absolute path to the directory containing {@code branch.csv}. */
    private final Path baseDataDir;
    /** Absolute path to the directory into which all artifacts are written. */
    private final Path dataDir;
    /** ISO date string used by Stage 2 as TODAY (clamps actionOn / uploadedOn, bounds requestDate). */
    private final String genToday;
    /** ISO date string used by Stage 3 as REF_DATE (anchors cal_date / cal_week / cal_month windows). */
    private final String reportToday;
    private final boolean skipStage0;
    private final boolean skipStage1;
    private final boolean skipStage2;

    public Path branchCsvPath() { return dataDir.resolve("branch.csv"); }
    public Path allCasesPath()  { return dataDir.resolve("all_cases.jsonl"); }
}
