// Applies indexes.json (canonical index definitions) to the current database.
// Idempotent: createIndex is a no-op when an index with the same keys + name
// already exists. Named indexes let subsequent runs match by name.
//
// Run from this directory:
//   mongosh "<uri>" 02_indexes.js

(function () {
  const fs = require('fs');
  const spec = JSON.parse(fs.readFileSync('indexes.json', 'utf8'));

  let created = 0, errors = 0;

  for (const idx of spec.indexes) {
    const coll = db.getCollection(idx.collection);
    const opts = idx.options || {};
    try {
      coll.createIndex(idx.keys, opts);
      print(`  ${idx.collection}.${opts.name || JSON.stringify(idx.keys)}` +
            (opts.unique ? ' (unique)' : ''));
      created++;
    } catch (e) {
      print(`! ${idx.collection}.${opts.name || JSON.stringify(idx.keys)}: ${e.message}`);
      errors++;
    }
  }

  print(`\ndone. applied ${created} indexes from indexes.json (errors=${errors}).`);
  print('list all indexes with db.<coll>.getIndexes()');
})();
