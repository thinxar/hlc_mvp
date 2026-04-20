// One-shot migration: rename pre-existing fields to camelCase and convert
// all_cases string dates to BSON Date. Run this ONCE after the code layers
// have been flipped to the camelCase + date-typed schema.
//
// Idempotent: each step filters by the old shape, so re-running is a no-op.
//
// Run from this directory:
//   mongosh "<uri>" 04_rename_camelcase.js
//
// After running, re-apply 01_collections.js + 02_indexes.js so the new
// validators and indexes are in place (old cal_*/Zone indexes are dropped
// here; new calDate/calWeek/calMonth/zone indexes are created by 02).

(function () {

  // ---------- 0. Drop obsolete indexes FIRST ----------
  // Unique composite indexes on the old field names (e.g. branchCode_1_cal_date_1)
  // would block the subsequent $rename with E11000 duplicate-key errors, because
  // renaming empties the old field (making all entries collide on null). Dropping
  // the old indexes first removes that constraint.
  const oldIndexes = [
    { coll: 'active_cases_branchwise',         names: ['branchCode_1_cal_date_1', 'cal_date_1', 'doCode_1_cal_date_1'] },
    { coll: 'active_cases_weekly_branchwise',  names: ['branchCode_1_cal_week_1', 'cal_week_1', 'doCode_1_cal_week_1'] },
    { coll: 'active_cases_monthly_branchwise', names: ['branchCode_1_cal_month_1', 'cal_month_1', 'doCode_1_cal_month_1'] },
    { coll: 'all_cases',                       names: ['PolicyNumber_1'] }
  ];
  for (const entry of oldIndexes) {
    const coll = db.getCollection(entry.coll);
    for (const name of entry.names) {
      try {
        coll.dropIndex(name);
        print(`${entry.coll}: dropped index ${name}`);
      } catch (e) {
        // already missing or never existed; fine
      }
    }
  }

  // ---------- 1. Rename top-level fields on the three aggregation collections ----------
  const aggRenames = [
    { coll: 'active_cases_branchwise',         map: { Zone: 'zone', cal_date: 'calDate' } },
    { coll: 'active_cases_weekly_branchwise',  map: { Zone: 'zone', cal_week: 'calWeek' } },
    { coll: 'active_cases_monthly_branchwise', map: { Zone: 'zone', cal_month: 'calMonth' } }
  ];
  for (const entry of aggRenames) {
    for (const [oldF, newF] of Object.entries(entry.map)) {
      const filter = { [oldF]: { $exists: true } };
      const res = db.getCollection(entry.coll).updateMany(filter, { $rename: { [oldF]: newF } });
      print(`${entry.coll}: ${oldF} -> ${newF} matched=${res.matchedCount} modified=${res.modifiedCount}`);
    }
  }

  // ---------- 2. Rename top-level fields on all_cases ----------
  const allCasesRenames = { Zone: 'zone', Channel: 'channel', PolicyNumber: 'policyNumber' };
  for (const [oldF, newF] of Object.entries(allCasesRenames)) {
    const res = db.all_cases.updateMany(
      { [oldF]: { $exists: true } },
      { $rename: { [oldF]: newF } }
    );
    print(`all_cases: ${oldF} -> ${newF} matched=${res.matchedCount} modified=${res.modifiedCount}`);
  }

  // ---------- 3. Convert all_cases top-level string dates to BSON Date ----------
  const topLevelDates = ['requestDate', 'commencementDate', 'lastPremiumPaidDate',
                         'lapseDate', 'revivalPeriodEndDate'];
  for (const f of topLevelDates) {
    const res = db.all_cases.updateMany(
      { [f]: { $type: 'string' } },
      [{ $set: { [f]: { $toDate: '$' + f } } }]
    );
    print(`all_cases.${f}: matched=${res.matchedCount} modified=${res.modifiedCount}`);
  }

  // ---------- 4. Convert nested documents[].uploadedOn / actionOn ----------
  // uploadedOn: ISO string -> BSON Date.
  // actionOn:   empty-string or "pending"-sentinel -> null; ISO string -> BSON Date.
  const nestedRes = db.all_cases.updateMany(
    { $or: [
        { 'documents.uploadedOn': { $type: 'string' } },
        { 'documents.actionOn':   { $type: 'string' } }
    ] },
    [{
      $set: {
        documents: {
          $map: {
            input: '$documents',
            as: 'd',
            in: {
              $mergeObjects: [
                '$$d',
                {
                  uploadedOn: {
                    $cond: [
                      { $eq: [{ $type: '$$d.uploadedOn' }, 'string'] },
                      { $toDate: '$$d.uploadedOn' },
                      '$$d.uploadedOn'
                    ]
                  },
                  actionOn: {
                    $cond: [
                      { $or: [
                          { $eq: ['$$d.actionOn', null] },
                          { $eq: ['$$d.actionOn', ''] }
                      ]},
                      null,
                      { $cond: [
                          { $eq: [{ $type: '$$d.actionOn' }, 'string'] },
                          { $toDate: '$$d.actionOn' },
                          '$$d.actionOn'
                      ]}
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    }]
  );
  print(`all_cases.documents[].(uploadedOn|actionOn): matched=${nestedRes.matchedCount} modified=${nestedRes.modifiedCount}`);

  print('\ndone. re-run 01_collections.js + 02_indexes.js to pick up the new validators + indexes.');
})();
