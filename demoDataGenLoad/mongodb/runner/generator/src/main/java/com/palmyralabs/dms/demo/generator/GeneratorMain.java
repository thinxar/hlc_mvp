package com.palmyralabs.dms.demo.generator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot entry point for the demo-data generator CLI.
 *
 * <p>Implements the pipeline specified in {@code claude/specs/demo_data/}.
 * Orchestrated by {@link PipelineRunner}; individual stages are
 * Spring {@code @Component}s under {@code com.palmyralabs.dms.demo.generator.stages}.
 *
 * <p>Usage:
 * <pre>
 *   java -jar generator.jar                         # uses system date
 *   java -jar generator.jar 2026-04-20              # pin genToday + reportToday
 *   GEN_TODAY=2026-04-20 java -jar generator.jar    # env var override
 *   SKIP_STAGE_0=1 java -jar generator.jar          # reuse generated/branch.csv
 * </pre>
 */
@SpringBootApplication
public class GeneratorMain {

    public static void main(String[] args) {
        SpringApplication.run(GeneratorMain.class, args);
    }
}
