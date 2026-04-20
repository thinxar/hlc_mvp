package com.palmyralabs.dms.revival.service.RevDataload;

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
import org.bson.Document;
import org.bson.conversions.Bson;

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
 * Loads the pipeline's generated JSON/JSONL files into MongoDB collections.
 * Mirrors the conventions of BulkReportsLoader: upsert-by-default via
 * bulkWrite, env-var and -D system-property overrides, candidate data-root
 * paths so the loader finds the data regardless of CWD, unique-key indexes
 * per collection.
 *
 * Files -> collections:
 *  1. branches.json                        -> branches                         (key: branchCode)
 *  2. zone_divisions.json                  -> zone_divisions                   (key: zone, divisionName)
 *  3. active_cases_branchwise.json         -> active_cases_branchwise          (key: branchCode, cal_date)
 *  4. active_cases_weekly_branchwise.json  -> active_cases_weekly_branchwise   (key: branchCode, cal_week)
 *  5. active_cases_monthly_branchwise.json -> active_cases_monthly_branchwise  (key: branchCode, cal_month)
 *  6. all_cases.jsonl                      -> all_cases                        (key: requestId) [streamed]
 */
public final class MongoDataLoader {

    private static final String DEFAULT_URI = "mongodb://demouser:secret@localhost:27017/dms?authSource=dms";
    private static final String DEFAULT_DB = "dms";
    private static final int DEFAULT_BATCH_SIZE = 1000;

    private static final String[] CANDIDATE_DATA_ROOTS = {
            "generated",
            "../generated",
            "../../claude/demo_data_generator/generated",
            "../../../claude/demo_data_generator/generated"
    };

    private static final String[] NONE = new String[0];

    private static final FileSpec[] FILES = new FileSpec[] {
            new FileSpec("branches.json",                        "branches",
                    new String[] { "branchCode" },             NONE,                         false),
            new FileSpec("zone_divisions.json",                  "zone_divisions",
                    new String[] { "zone", "divisionName" },   NONE,                         false),
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

    public static void main(String[] args) {
        String uri = env("MONGO_URI", DEFAULT_URI);
        String dbName = env("MONGO_DB", DEFAULT_DB);
        int batchSize = parseIntOr(env("BATCH_SIZE", null), DEFAULT_BATCH_SIZE);
        boolean upsert = !"insert".equalsIgnoreCase(env("MODE", "upsert"));
        Path root = resolveDataRoot(args.length > 0 ? args[0] : env("DATA_DIR", null));

        System.out.printf("Loading data from %s -> %s (mode=%s, batch=%d)%n",
                root, dbName, upsert ? "upsert" : "insert", batchSize);

        ObjectMapper mapper = new ObjectMapper();
        Instant started = Instant.now();

        try (MongoClient client = MongoClients.create(uri)) {
            MongoDatabase db = client.getDatabase(dbName);
            long grandTotal = 0;

            for (FileSpec spec : FILES) {
                Path input = root.resolve(spec.fileName);
                if (!Files.isRegularFile(input)) {
                    System.err.printf("[SKIP] %s not found at %s%n", spec.fileName, input);
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
            System.out.printf("All files loaded. totalRecords=%d elapsed=%ds%n",
                    grandTotal, took.toSeconds());
        } catch (Exception e) {
            System.err.println("Load failed: " + e.getMessage());
            e.printStackTrace(System.err);
            System.exit(1);
        }
    }

    private static long loadJsonArray(ObjectMapper mapper, Path input, MongoCollection<Document> coll,
                                      FileSpec spec, int batchSize, boolean upsert) throws IOException {
        Instant started = Instant.now();
        List<Map<String, Object>> records = mapper.readValue(input.toFile(),
                new TypeReference<List<Map<String, Object>>>() {});
        System.out.printf("  %-42s -> %-38s (%d records)%n",
                input.getFileName(), spec.collection, records.size());

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
        System.out.printf("    done records=%d upserted=%d inserted=%d modified=%d matched=%d elapsed=%ds%n",
                total, upserted, inserted, modified, matched, took.toSeconds());
        return total;
    }

    private static long loadJsonl(Path input, MongoCollection<Document> coll, FileSpec spec,
                                  int batchSize, boolean upsert) throws IOException {
        Instant started = Instant.now();
        System.out.printf("  %-42s -> %-38s (streaming)%n",
                input.getFileName(), spec.collection);

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
                        System.out.printf("    progress: %d records loaded%n", total);
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
        System.out.printf("    done records=%d upserted=%d inserted=%d modified=%d matched=%d elapsed=%ds%n",
                total, upserted, inserted, modified, matched, took.toSeconds());
        return total;
    }

    private static void normalizeDateFields(Document doc, String[] dateFields) {
        if (dateFields.length == 0) return;
        for (String field : dateFields) {
            int bracket = field.indexOf("[]");
            if (bracket < 0) {
                convertIfString(doc, field);
            } else {
                // Path like "documents[].uploadedOn" — traverse the array.
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

    private static Path resolveDataRoot(String override) {
        if (override != null && !override.isBlank()) {
            Path p = Paths.get(override);
            if (!Files.isDirectory(p)) {
                throw new IllegalArgumentException("DATA_DIR not found: " + p.toAbsolutePath());
            }
            return p;
        }
        for (String candidate : CANDIDATE_DATA_ROOTS) {
            Path p = Paths.get(candidate);
            if (Files.isDirectory(p)) return p.toAbsolutePath().normalize();
        }
        throw new IllegalStateException("generated directory not found. Set -DDATA_DIR=... or place at one of: "
                + String.join(", ", CANDIDATE_DATA_ROOTS));
    }

    private static String env(String key, String fallback) {
        String v = System.getProperty(key);
        if (v == null || v.isBlank()) v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }

    private static int parseIntOr(String s, int fallback) {
        if (s == null) return fallback;
        try {
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    private static final class FileSpec {
        final String fileName;
        final String collection;
        final String[] keyFields;
        final String[] dateFields;
        final boolean jsonl;

        FileSpec(String fileName, String collection, String[] keyFields, String[] dateFields, boolean jsonl) {
            this.fileName = fileName;
            this.collection = collection;
            this.keyFields = keyFields;
            this.dateFields = dateFields;
            this.jsonl = jsonl;
        }

        @Override
        public String toString() {
            return fileName + " -> " + collection + " key=" + Arrays.toString(keyFields)
                    + " dates=" + Arrays.toString(dateFields);
        }
    }
}

