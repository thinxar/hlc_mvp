package com.palmyralabs.dms.demo.loader;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.bulk.BulkWriteResult;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.BulkWriteOptions;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import com.mongodb.client.model.InsertOneModel;
import com.mongodb.client.model.ReplaceOneModel;
import com.mongodb.client.model.ReplaceOptions;
import com.mongodb.client.model.WriteModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Port of {@code MongoDataLoader} from the {@code dms-revival} module, wrapped
 * as a Spring {@link ApplicationRunner}.
 *
 * <p>Files -&gt; collections (see {@link #FILES}):
 * <ol>
 *   <li>branches.json</li>
 *   <li>zone_divisions.json</li>
 *   <li>active_cases_branchwise.json</li>
 *   <li>active_cases_weekly_branchwise.json</li>
 *   <li>active_cases_monthly_branchwise.json</li>
 *   <li>all_cases.jsonl (streamed)</li>
 * </ol>
 *
 * <p>A missing file is warned and skipped, matching the original behaviour.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MongoLoaderRunner implements ApplicationRunner {

    private static final String[] CANDIDATE_DATA_ROOTS = {
            "generated",
            "../generated",
            "../../generated",
            "../../claude/demo_data_generator/generated",
            "../../../claude/demo_data_generator/generated"
    };

    private static final String[] NONE = new String[0];

    private static final FileSpec[] FILES = new FileSpec[] {
            new FileSpec("branches.json",                        "branches",
                    new String[] { "branchCode" },              NONE,                         false),
            new FileSpec("zone_divisions.json",                  "zone_divisions",
                    new String[] { "zone", "divisionName" },    NONE,                         false),
            new FileSpec("active_cases_branchwise.json",         "active_cases_branchwise",
                    new String[] { "branchCode", "calDate" },   new String[] { "calDate" },   false),
            new FileSpec("active_cases_weekly_branchwise.json",  "active_cases_weekly_branchwise",
                    new String[] { "branchCode", "calWeek" },   new String[] { "calWeek" },   false),
            new FileSpec("active_cases_monthly_branchwise.json", "active_cases_monthly_branchwise",
                    new String[] { "branchCode", "calMonth" },  new String[] { "calMonth" },  false),
            new FileSpec("all_cases.jsonl",                      "all_cases",
                    new String[] { "requestId" },
                    new String[] { "requestDate", "commencementDate", "lastPremiumPaidDate",
                                   "lapseDate", "revivalPeriodEndDate",
                                   "documents[].uploadedOn", "documents[].actionOn" },
                    true)
    };

    private final LoaderConfig cfg;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        LoaderConfig.Mongo m = cfg.getMongo();
        String uri = firstNonBlank(env("MONGO_URI"), sys("app.mongo.uri"), m.getUri());
        String dbName = firstNonBlank(env("MONGO_DB"), sys("app.mongo.db"), m.getDb());
        int batchSize = parseIntOr(firstNonBlank(env("BATCH_SIZE"), sys("app.mongo.batchSize"),
                Integer.toString(m.getBatchSize())), 1000);
        String modeStr = firstNonBlank(env("MODE"), sys("app.mongo.mode"), m.getMode());
        boolean upsert = !"insert".equalsIgnoreCase(modeStr);

        String dataDirOverride = null;
        List<String> positional = args.getNonOptionArgs();
        if (!positional.isEmpty()) dataDirOverride = positional.get(0);
        if (dataDirOverride == null) dataDirOverride = firstNonBlank(env("DATA_DIR"), sys("app.dataDir"));
        if (dataDirOverride == null) dataDirOverride = cfg.getDataDir();

        Path root = resolveDataRoot(dataDirOverride);

        log.info("Loading data from {} -> {} (mode={}, batch={})",
                root, dbName, upsert ? "upsert" : "insert", batchSize);

        ObjectMapper mapper = new ObjectMapper();
        Instant started = Instant.now();

        try (MongoClient client = MongoClients.create(uri)) {
            MongoDatabase db = client.getDatabase(dbName);
            long grandTotal = 0;

            for (FileSpec spec : FILES) {
                Path input = root.resolve(spec.fileName);
                if (!Files.isRegularFile(input)) {
                    log.warn("[SKIP] {} not found at {}", spec.fileName, input);
                    continue;
                }
                MongoCollection<Document> coll = db.getCollection(spec.collection);
                ensureIndexes(coll, spec);

                long loaded = spec.jsonl
                        ? loadJsonl(input, coll, spec, batchSize, upsert)
                        : loadJsonArray(mapper, input, coll, spec, batchSize, upsert);
                grandTotal += loaded;
            }

            Duration took = Duration.between(started, Instant.now());
            log.info("All files loaded. totalRecords={} elapsed={}s", grandTotal, took.toSeconds());
        } catch (Exception e) {
            log.error("Load failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    private static long loadJsonArray(ObjectMapper mapper, Path input, MongoCollection<Document> coll,
                                      FileSpec spec, int batchSize, boolean upsert) throws IOException {
        Instant started = Instant.now();
        List<Map<String, Object>> records = mapper.readValue(input.toFile(),
                new TypeReference<List<Map<String, Object>>>() {});
        log.info("  {} -> {} ({} records)", input.getFileName(), spec.collection, records.size());

        List<WriteModel<Document>> batch = new ArrayList<>(batchSize);
        BulkWriteOptions opts = new BulkWriteOptions().ordered(false);
        long total = 0, upserted = 0, modified = 0, inserted = 0, matched = 0;

        for (Map<String, Object> map : records) {
            Document doc = new Document(map);
            normalizeDateFields(doc, spec.dateFields);
            batch.add(buildWrite(doc, spec, total + 1, input, upsert));
            total++;
            if (batch.size() >= batchSize) {
                BulkWriteResult r = coll.bulkWrite(batch, opts);
                upserted += r.getUpserts().size();
                modified += r.getModifiedCount();
                inserted += r.getInsertedCount();
                matched += r.getMatchedCount();
                batch.clear();
            }
        }
        if (!batch.isEmpty()) {
            BulkWriteResult r = coll.bulkWrite(batch, opts);
            upserted += r.getUpserts().size();
            modified += r.getModifiedCount();
            inserted += r.getInsertedCount();
            matched += r.getMatchedCount();
        }
        Duration took = Duration.between(started, Instant.now());
        log.info("    done records={} upserted={} inserted={} modified={} matched={} elapsed={}s",
                total, upserted, inserted, modified, matched, took.toSeconds());
        return total;
    }

    private static long loadJsonl(Path input, MongoCollection<Document> coll, FileSpec spec,
                                  int batchSize, boolean upsert) throws IOException {
        Instant started = Instant.now();
        log.info("  {} -> {} (streaming)", input.getFileName(), spec.collection);

        List<WriteModel<Document>> batch = new ArrayList<>(batchSize);
        BulkWriteOptions opts = new BulkWriteOptions().ordered(false);
        long total = 0, upserted = 0, modified = 0, inserted = 0, matched = 0;

        try (BufferedReader reader = Files.newBufferedReader(input, StandardCharsets.UTF_8)) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) continue;
                Document doc = Document.parse(line);
                normalizeDateFields(doc, spec.dateFields);
                batch.add(buildWrite(doc, spec, total + 1, input, upsert));
                total++;
                if (batch.size() >= batchSize) {
                    BulkWriteResult r = coll.bulkWrite(batch, opts);
                    upserted += r.getUpserts().size();
                    modified += r.getModifiedCount();
                    inserted += r.getInsertedCount();
                    matched += r.getMatchedCount();
                    batch.clear();
                    if (total % 50_000 == 0) {
                        log.info("    progress: {} records loaded", total);
                    }
                }
            }
        }
        if (!batch.isEmpty()) {
            BulkWriteResult r = coll.bulkWrite(batch, opts);
            upserted += r.getUpserts().size();
            modified += r.getModifiedCount();
            inserted += r.getInsertedCount();
            matched += r.getMatchedCount();
        }
        Duration took = Duration.between(started, Instant.now());
        log.info("    done records={} upserted={} inserted={} modified={} matched={} elapsed={}s",
                total, upserted, inserted, modified, matched, took.toSeconds());
        return total;
    }

    /**
     * Coerces ISO-date string fields to BSON Date at UTC midnight. Supports
     * nested paths via the "parent[].child" syntax (only one level deep;
     * used for {@code documents[].uploadedOn} / {@code documents[].actionOn}).
     */
    private static void normalizeDateFields(Document doc, String[] dateFields) {
        if (dateFields.length == 0) return;
        for (String field : dateFields) {
            int bracket = field.indexOf("[]");
            if (bracket < 0) {
                convertIfString(doc, field);
            } else {
                String parentKey = field.substring(0, bracket);
                String childKey = field.substring(bracket + 3);  // skip "[]."
                Object arr = doc.get(parentKey);
                if (arr instanceof List<?> list) {
                    for (Object item : list) {
                        if (item instanceof Document d) convertIfString(d, childKey);
                    }
                }
            }
        }
    }

    private static void convertIfString(Document doc, String field) {
        Object v = doc.get(field);
        if (v instanceof String s && !s.isBlank()) {
            LocalDate ld = LocalDate.parse(s);
            doc.put(field, Date.from(ld.atStartOfDay(ZoneOffset.UTC).toInstant()));
        }
    }

    private static WriteModel<Document> buildWrite(Document doc, FileSpec spec, long recordNum,
                                                   Path input, boolean upsert) {
        if (upsert) {
            Bson filter = buildKeyFilter(doc, spec.keyFields, recordNum, input);
            return new ReplaceOneModel<>(filter, doc, new ReplaceOptions().upsert(true));
        }
        return new InsertOneModel<>(doc);
    }

    private static Bson buildKeyFilter(Document doc, String[] keyFields, long recordNum, Path input) {
        List<Bson> parts = new ArrayList<>(keyFields.length);
        for (String field : keyFields) {
            Object value = doc.get(field);
            if (value == null) {
                throw new IllegalStateException(String.format("Key field '%s' missing on record #%d of %s",
                        field, recordNum, input.getFileName()));
            }
            parts.add(Filters.eq(field, value));
        }
        return parts.size() == 1 ? parts.get(0) : Filters.and(parts);
    }

    private static void ensureIndexes(MongoCollection<Document> coll, FileSpec spec) {
        coll.createIndex(Indexes.ascending(spec.keyFields), new IndexOptions().unique(true));
        boolean branchCodeIsSoleKey = spec.keyFields.length == 1 && "branchCode".equals(spec.keyFields[0]);
        boolean hasBranchCode = Arrays.asList(spec.keyFields).contains("branchCode");
        if (!branchCodeIsSoleKey && hasBranchCode) {
            coll.createIndex(Indexes.ascending("branchCode"));
        }
    }

    /**
     * Resolve a data directory to an absolute path. If the explicit override
     * is present and a directory, use it. Otherwise fall through the candidate
     * roots for compatibility with the original MongoDataLoader.
     */
    private static Path resolveDataRoot(String override) {
        if (override != null && !override.isBlank()) {
            Path p = Paths.get(override).toAbsolutePath().normalize();
            if (Files.isDirectory(p)) return p;
            log.warn("app.dataDir/DATA_DIR '{}' is not a directory; trying fallback candidates", p);
        }
        for (String candidate : CANDIDATE_DATA_ROOTS) {
            Path p = Paths.get(candidate);
            if (Files.isDirectory(p)) return p.toAbsolutePath().normalize();
        }
        throw new IllegalStateException("generated directory not found. Set app.dataDir=... or DATA_DIR=..."
                + " or place it at one of: " + String.join(", ", CANDIDATE_DATA_ROOTS));
    }

    // ---------- small helpers ----------
    private static String env(String key) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? null : v;
    }

    private static String sys(String key) {
        String v = System.getProperty(key);
        return (v == null || v.isBlank()) ? null : v;
    }

    private static String firstNonBlank(String... xs) {
        for (String x : xs) if (x != null && !x.isBlank()) return x;
        return null;
    }

    private static int parseIntOr(String s, int fallback) {
        if (s == null) return fallback;
        try { return Integer.parseInt(s.trim()); } catch (NumberFormatException e) { return fallback; }
    }
}
