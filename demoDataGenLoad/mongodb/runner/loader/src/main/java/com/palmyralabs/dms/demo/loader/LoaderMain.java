package com.palmyralabs.dms.demo.loader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot entry point for the Mongo loader CLI.
 *
 * <p>Loads the 7 files produced by the generator (6 pretty JSON arrays +
 * {@code all_cases.jsonl}) into their respective MongoDB collections.
 * Port of {@code mongo-service/service/dms-revival/.../MongoDataLoader.java}
 * wrapped as a Spring app with {@code @ConfigurationProperties}.
 *
 * <p>Usage:
 * <pre>
 *   java -jar loader.jar                       # defaults from application.yaml
 *   java -jar loader.jar /path/to/generated    # positional arg overrides dataDir
 *   DATA_DIR=/path/to/generated java -jar loader.jar
 *   java -Dapp.mongo.uri=mongodb://... -jar loader.jar
 * </pre>
 */
@SpringBootApplication
public class LoaderMain {
    public static void main(String[] args) {
        SpringApplication.run(LoaderMain.class, args);
    }
}
