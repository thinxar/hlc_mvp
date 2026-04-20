// DEV ONLY — drops every collection named in collections.json. Destructive.
// Use before a clean reload when you want to remove schema drift or stale
// indexes entirely.
//
// Run from this directory:
//   mongosh "<uri>" 99_drop.js

(function () {
  const fs = require('fs');
  const spec = JSON.parse(fs.readFileSync('collections.json', 'utf8'));

  const existing = new Set(db.getCollectionNames());
  for (const c of spec.collections) {
    if (existing.has(c.name)) {
      db.getCollection(c.name).drop();
      print(`dropped ${c.name}`);
    } else {
      print(`skip    ${c.name} (does not exist)`);
    }
  }
  print('\ndone. re-run 01_collections.js + 02_indexes.js before the next load.');
})();
