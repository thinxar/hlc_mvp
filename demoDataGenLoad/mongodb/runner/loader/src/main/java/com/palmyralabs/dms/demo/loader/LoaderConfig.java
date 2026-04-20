package com.palmyralabs.dms.demo.loader;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Binds the {@code app.*} block from application.yaml.
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app")
public class LoaderConfig {

    private String dataDir = "generated";
    private Mongo mongo = new Mongo();

    @Getter
    @Setter
    public static class Mongo {
        private String uri = "mongodb://demouser:secret@localhost:27017/dms?authSource=dms";
        private String db = "dms";
        private int batchSize = 1000;
        /** "upsert" (default) or "insert". */
        private String mode = "upsert";
    }
}
