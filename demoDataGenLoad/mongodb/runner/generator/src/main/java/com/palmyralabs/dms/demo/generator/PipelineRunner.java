package com.palmyralabs.dms.demo.generator;

import com.palmyralabs.dms.demo.generator.stages.Stage0Cleanser;
import com.palmyralabs.dms.demo.generator.stages.Stage1BranchExtractor;
import com.palmyralabs.dms.demo.generator.stages.Stage1ZoneDivisionExtractor;
import com.palmyralabs.dms.demo.generator.stages.Stage2CaseGenerator;
import com.palmyralabs.dms.demo.generator.stages.Stage3DailyAggregator;
import com.palmyralabs.dms.demo.generator.stages.Stage3MonthlyAggregator;
import com.palmyralabs.dms.demo.generator.stages.Stage3WeeklyAggregator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

/**
 * Orchestrates Stage 0..3 per {@code specs/pipeline/run_order_spec.txt}.
 *
 * <p>Date resolution (mirrors {@code scripts/run_pipeline.js}):
 * <ol>
 *   <li>First CLI positional arg, if present, sets both {@code genToday} and {@code reportToday}.</li>
 *   <li>Env vars {@code GEN_TODAY} / {@code REPORT_TODAY} (mirrored to each other if only one is set).</li>
 *   <li>System properties of the same names.</li>
 *   <li>{@code app.genToday} / {@code app.reportToday} from application.yaml.</li>
 *   <li>System date if nothing above resolved.</li>
 * </ol>
 * Skip flags fall through env/prop/yaml similarly.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PipelineRunner implements ApplicationRunner {

    private final GeneratorConfig cfg;
    private final Stage0Cleanser stage0;
    private final Stage1BranchExtractor stage1branches;
    private final Stage1ZoneDivisionExtractor stage1zoneDiv;
    private final Stage2CaseGenerator stage2;
    private final Stage3DailyAggregator stage3daily;
    private final Stage3WeeklyAggregator stage3weekly;
    private final Stage3MonthlyAggregator stage3monthly;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        PipelineContext ctx = buildContext(args.getNonOptionArgs());
        log.info("=== palm-demo data pipeline (Java) ===");
        log.info("baseDataDir  : {}", ctx.getBaseDataDir());
        log.info("dataDir      : {}", ctx.getDataDir());
        log.info("GEN_TODAY    : {}", ctx.getGenToday());
        log.info("REPORT_TODAY : {}", ctx.getReportToday());

        Files.createDirectories(ctx.getDataDir());

        // Stage 0 - cleanse master CSV
        if (ctx.isSkipStage0()) {
            log.info("--- skipping Stage 0 (skipStage0=true); reusing {} ---", ctx.branchCsvPath());
            if (!Files.isRegularFile(ctx.branchCsvPath())) {
                throw new IllegalStateException(
                        ctx.branchCsvPath() + " missing; rerun without skipStage0.");
            }
        } else {
            runStage("stage0 cleanse", () -> stage0.run(ctx));
        }

        // Stage 1 - reference data extractions (independent)
        if (ctx.isSkipStage1()) {
            log.info("--- skipping Stage 1 (skipStage1=true) ---");
        } else {
            runStage("stage1 branches",       () -> stage1branches.run(ctx));
            runStage("stage1 zone_divisions", () -> stage1zoneDiv.run(ctx));
        }

        // Stage 2 - master dataset
        if (ctx.isSkipStage2()) {
            log.info("--- skipping Stage 2 (skipStage2=true); reusing {} ---", ctx.allCasesPath());
            if (!Files.isRegularFile(ctx.allCasesPath())) {
                throw new IllegalStateException(
                        ctx.allCasesPath() + " missing; rerun without skipStage2.");
            }
        } else {
            runStage("stage2 all_cases", () -> stage2.run(ctx));
        }

        // Stage 3 - aggregations (mutually independent; run sequentially for cleaner logs)
        runStage("stage3 daily",   () -> stage3daily.run(ctx));
        runStage("stage3 weekly",  () -> stage3weekly.run(ctx));
        runStage("stage3 monthly", () -> stage3monthly.run(ctx));

        log.info("=== pipeline complete ===");
    }

    private PipelineContext buildContext(List<String> positional) {
        String today = LocalDate.now().toString();

        // 1. CLI positional arg
        String positionalDate = positional.isEmpty() ? null : positional.get(0);

        // 2. env / sys prop
        String envGen    = env("GEN_TODAY");
        String envReport = env("REPORT_TODAY");

        // 3. yaml
        String yamlGen    = trimToNull(cfg.getGenToday());
        String yamlReport = trimToNull(cfg.getReportToday());

        String genToday    = firstNonBlank(positionalDate, envGen,    yamlGen,    null);
        String reportToday = firstNonBlank(positionalDate, envReport, yamlReport, null);

        // Mirror one to the other if exactly one is set (matches run_pipeline.js behavior).
        if (genToday != null && reportToday == null) reportToday = genToday;
        if (reportToday != null && genToday == null) genToday = reportToday;
        if (genToday == null)    genToday = today;
        if (reportToday == null) reportToday = today;

        // Skip flags: env "1" > yaml boolean
        boolean skip0 = envFlag("SKIP_STAGE_0", cfg.isSkipStage0());
        boolean skip1 = envFlag("SKIP_STAGE_1", cfg.isSkipStage1());
        boolean skip2 = envFlag("SKIP_STAGE_2", cfg.isSkipStage2());

        Path base = Paths.get(cfg.getBaseDataDir()).toAbsolutePath().normalize();
        Path out  = Paths.get(cfg.getDataDir()).toAbsolutePath().normalize();

        return new PipelineContext(base, out, genToday, reportToday, skip0, skip1, skip2);
    }

    private static void runStage(String label, Stage body) throws Exception {
        long start = System.currentTimeMillis();
        log.info(">>> [{}] start", label);
        try {
            body.run();
        } catch (Exception e) {
            log.error("!!! [{}] FAILED: {}", label, e.getMessage(), e);
            throw e;
        }
        long ms = System.currentTimeMillis() - start;
        log.info("<<< [{}] ok ({}s)", label, String.format("%.1f", ms / 1000.0));
    }

    @FunctionalInterface
    private interface Stage { void run() throws Exception; }

    private static String env(String key) {
        String v = System.getProperty(key);
        if (v == null || v.isBlank()) v = System.getenv(key);
        return (v == null || v.isBlank()) ? null : v;
    }

    private static boolean envFlag(String key, boolean fallback) {
        String v = env(key);
        if (v == null) return fallback;
        return "1".equals(v) || "true".equalsIgnoreCase(v);
    }

    private static String firstNonBlank(String... xs) {
        for (String x : xs) if (x != null && !x.isBlank()) return x;
        return null;
    }

    private static String trimToNull(String s) {
        if (s == null) return null;
        s = s.trim();
        return s.isEmpty() ? null : s;
    }
}
