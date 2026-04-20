# MongoDB DDL — demo data

Language-agnostic collection + index + migration definitions for the
7 collections produced by the demo pipeline. The canonical specs live
in three plain-JSON files; the `.js` files are thin mongosh appliers.
Any other driver (Spring Data Mongo, the Java sync driver, Node.js
`mongodb`) can consume the same JSON.

## Files

| File                             | Role                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| `collections.json`               | **Canonical** — 7 collections with JSON Schema validators + validation level/action. |
| `indexes.json`                   | **Canonical** — unique primary keys + secondary indexes for each collection. |
| `migrations.json`                | **Canonical** — legacy string-to-BSON-Date migration for 4 aggregation time-bucket fields. |
| `01_collections.js`              | mongosh applier — reads `collections.json`, calls `createCollection` / `collMod`. |
| `02_indexes.js`                  | mongosh applier — reads `indexes.json`, calls `createIndex`.          |
| `03_migrate_string_dates.js`     | mongosh applier — reads `migrations.json`, runs `$toDate` updates.    |
| `04_rename_camelcase.js`         | one-shot migration — renames legacy `Zone`/`Channel`/`PolicyNumber`/`cal_date`/`cal_week`/`cal_month` to camelCase, converts `all_cases` string-date fields (incl. nested `documents[]`) to BSON Date, and drops obsolete indexes. |
| `99_drop.js`                     | mongosh applier — drops every collection named in `collections.json` (DEV ONLY). |

## Collections covered

| Collection                           | Key                                    | Date fields (BSON Date, UTC midnight) |
| ------------------------------------ | -------------------------------------- | -------------------------------------- |
| `branches`                           | `branchCode` (unique)                  | —                                      |
| `zone_divisions`                     | `(zone, divisionName)` (unique)        | —                                      |
| `active_cases_branchwise`            | `(branchCode, cal_date)` (unique)      | `cal_date`                             |
| `active_cases_weekly_branchwise`     | `(branchCode, cal_week)` (unique)      | `cal_week`                             |
| `active_cases_monthly_branchwise`    | `(branchCode, cal_month)` (unique)     | `cal_month`                            |
| `all_cases`                          | `requestId` (unique)                   | — (stored as ISO strings; see caveat)  |

## Applying from mongosh

```bash
# Smoke-test connection
mongosh "mongodb://demouser:secret@localhost:27017/dms?authSource=dms" \
  --eval 'db.runCommand({ ping: 1 })'

# Run from THIS directory (scripts read the JSON files with a relative path)
cd demoDataGenLoad/mongodb/ddl

mongosh "$MONGO_URI" 01_collections.js
mongosh "$MONGO_URI" 02_indexes.js
mongosh "$MONGO_URI" 03_migrate_string_dates.js   # only needed for legacy data
mongosh "$MONGO_URI" 99_drop.js                   # DEV ONLY
```

The loader (`demoDataGenLoad/mongodb/runner/loader`) also creates the
primary unique indexes on startup, so `02_indexes.js` is optional for
a fresh load — it just pre-creates secondary indexes.

## Applying from Java (Spring Boot or plain driver)

Same JSON files, parsed with Jackson and fed to the Mongo sync driver.
Sketch:

```java
// read canonical defs
ObjectMapper m = new ObjectMapper();
JsonNode collections = m.readTree(Path.of("collections.json").toFile());
JsonNode indexes     = m.readTree(Path.of("indexes.json").toFile());

MongoDatabase db = client.getDatabase("dms");
Set<String> existing = new HashSet<>();
db.listCollectionNames().into(existing);

// 1. collections
for (JsonNode c : collections.get("collections")) {
    String name = c.get("name").asText();
    Document opts = Document.parse(c.get("options").toString());
    if (existing.contains(name)) {
        Document cmd = new Document("collMod", name).append("validator", opts.get("validator"));
        if (opts.containsKey("validationLevel"))  cmd.append("validationLevel",  opts.get("validationLevel"));
        if (opts.containsKey("validationAction")) cmd.append("validationAction", opts.get("validationAction"));
        db.runCommand(cmd);
    } else {
        db.createCollection(name, new CreateCollectionOptions()
            .validationOptions(new ValidationOptions()
                .validator((Bson) opts.get("validator"))
                .validationLevel(ValidationLevel.fromString((String) opts.get("validationLevel")))
                .validationAction(ValidationAction.fromString((String) opts.get("validationAction")))));
    }
}

// 2. indexes
for (JsonNode idx : indexes.get("indexes")) {
    MongoCollection<Document> coll = db.getCollection(idx.get("collection").asText());
    Bson keys = Document.parse(idx.get("keys").toString());
    IndexOptions io = new IndexOptions();
    JsonNode opts = idx.get("options");
    if (opts != null) {
        if (opts.has("unique")) io.unique(opts.get("unique").asBoolean());
        if (opts.has("name"))   io.name(opts.get("name").asText());
    }
    coll.createIndex(keys, io);
}
```

## Applying from Node.js

Same JSON files, parsed with `JSON.parse` and fed to the `mongodb`
driver.

```js
const fs = require('fs');
const { MongoClient } = require('mongodb');

const client = await MongoClient.connect(process.env.MONGO_URI);
const db = client.db(process.env.MONGO_DB || 'dms');

const collections = JSON.parse(fs.readFileSync('collections.json', 'utf8'));
const indexes     = JSON.parse(fs.readFileSync('indexes.json', 'utf8'));

const existing = new Set((await db.listCollections().toArray()).map(c => c.name));
for (const c of collections.collections) {
    if (existing.has(c.name)) {
        await db.command(Object.assign({ collMod: c.name }, c.options));
    } else {
        await db.createCollection(c.name, c.options);
    }
}
for (const idx of indexes.indexes) {
    await db.collection(idx.collection).createIndex(idx.keys, idx.options);
}
```

## JSON wire-format conventions

- **Index direction**: integers `1` (ascending) / `-1` (descending). When
  parsing from JSON, keep them as integers — a double `1.0` is rejected
  by some drivers.
- **BSON types**: the validator `bsonType` values are strings (`"date"`,
  `"string"`, `"int"`, `"long"`, `"object"`, `"array"`). The
  `["int", "long"]` array form means "int or long".
- **No BSON type hints in migrations.json**: the `$toDate` stage
  converts the string to Date at update time; no driver-side date
  parsing is needed.
- **Comments**: only the top-level `_comment` keys hold inline docs.
  Drivers ignore unknown top-level keys, so these are safe.

## Idempotency

All four appliers are safe to re-run:

- `01_collections.js` — `createCollection` for new collections, `collMod`
  for existing ones (updates validator in-place).
- `02_indexes.js` — `createIndex` is a no-op when the index already
  exists with identical keys + options. Named indexes make re-runs
  deterministic.
- `03_migrate_string_dates.js` — `{$type: "string"}` guard skips
  already-migrated rows. Safe to run against a fully-migrated database.
- `99_drop.js` — drops whether or not the collection exists.

## Related specs + code

- Canonical collection shape: `claude/specs/demo_data/data_model/*.txt`
  (depends on `data_gen/` and `aggregation/` upstream specs).
- Java entities consuming the collections:
  `mongo-service/service/dms-revival/src/main/java/com/palmyralabs/dms/revival/entity/`
- Generator + loader: `demoDataGenLoad/mongodb/runner/generator|loader`
