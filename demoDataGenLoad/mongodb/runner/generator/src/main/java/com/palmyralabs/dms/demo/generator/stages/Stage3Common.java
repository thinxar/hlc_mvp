package com.palmyralabs.dms.demo.generator.stages;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Consumer;

/**
 * Small helpers shared by every Stage 3 aggregator.
 */
final class Stage3Common {
    private Stage3Common() {}

    /** Stream {@code all_cases.jsonl} one record at a time. Skips blank lines. */
    static void streamJsonl(Path inPath, Consumer<JsonNode> consumer) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        try (BufferedReader r = Files.newBufferedReader(inPath, StandardCharsets.UTF_8)) {
            String line;
            while ((line = r.readLine()) != null) {
                if (line.isEmpty() || line.isBlank()) continue;
                JsonNode node = mapper.readTree(line);
                consumer.accept(node);
            }
        }
    }
}
