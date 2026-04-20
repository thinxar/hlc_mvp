package com.palmyralabs.dms.demo.generator;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Binds the {@code app.*} block from application.yaml. See the yaml for field
 * semantics. Env vars and CLI positional arg override these at startup; see
 * {@link PipelineRunner#resolveDates}.
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app")
public class GeneratorConfig {
    private String baseDataDir = "base_data";
    private String dataDir = "generated";
    private String genToday;       // null -> system date
    private String reportToday;    // null -> system date
    private boolean skipStage0;
    private boolean skipStage1;
    private boolean skipStage2;
}
