// Applies collections.json (canonical validator definitions) to the current
// database. Idempotent: uses db.createCollection on new ones and db.runCommand
// ({collMod: …}) on existing ones to update the validator in-place.
//
// Run from this directory:
//   mongosh "<uri>" 01_collections.js
//
// The canonical definitions live in collections.json so Spring Boot / Node
// appliers can consume the exact same specs without re-implementing them.

(function () {
  const fs = require('fs');
  const spec = JSON.parse(fs.readFileSync('collections.json', 'utf8'));

  const existing = new Set(db.getCollectionNames());

  for (const c of spec.collections) {
    const opts = c.options || {};
    if (existing.has(c.name)) {
      const r = db.runCommand(Object.assign(
        { collMod: c.name },
        opts.validator        !== undefined ? { validator:        opts.validator        } : {},
        opts.validationLevel  !== undefined ? { validationLevel:  opts.validationLevel  } : {},
        opts.validationAction !== undefined ? { validationAction: opts.validationAction } : {}
      ));
      print(`collMod ${c.name}: ok=${r.ok}`);
    } else {
      db.createCollection(c.name, opts);
      print(`created ${c.name}`);
    }
  }

  print(`\ndone. applied ${spec.collections.length} collection definitions from collections.json.`);
  print('validationAction is "warn" - invalid docs are logged, not rejected.');
  print('switch to "error" in collections.json once the noCases/no_cases field is unified.');
})();
