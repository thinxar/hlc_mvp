// Applies migrations.json#stringToDate — converts legacy ISO-string dates to
// BSON Date (UTC midnight) on the four aggregation time-bucket fields.
// Idempotent: {$type: "string"} guard skips rows that are already Dates.
//
// Run from this directory:
//   mongosh "<uri>" 03_migrate_string_dates.js
//
// NOTE: all_cases date fields are intentionally NOT in migrations.json —
// per specs/demo_data/data_model/all_cases.txt they stay as ISO strings.

(function () {
  const fs = require('fs');
  const spec = JSON.parse(fs.readFileSync('migrations.json', 'utf8'));

  let grandTotal = 0;

  for (const m of spec.stringToDate) {
    const filter = {};
    filter[m.field] = { $type: 'string' };

    const preCount = db.getCollection(m.collection).countDocuments(filter);
    if (preCount === 0) {
      print(`${m.collection}.${m.field}: already migrated (0 string values)`);
      continue;
    }

    const setStage = {};
    setStage[m.field] = { $toDate: '$' + m.field };
    const r = db.getCollection(m.collection).updateMany(filter, [{ $set: setStage }]);
    grandTotal += r.modifiedCount;
    print(`${m.collection}.${m.field}: matched=${r.matchedCount} modified=${r.modifiedCount}`);
  }

  print(`\ndone. total rows migrated: ${grandTotal}`);
})();
