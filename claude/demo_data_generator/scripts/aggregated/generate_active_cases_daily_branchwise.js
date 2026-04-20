// Aggregator for specs/aggregation/active_cases_agg_spec.txt.
// Reads generated/all_cases.jsonl, applies case selection at REF_DATE,
// then rolls up one row per (cal_date, branchCode) over the 15-day window.

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const projectRoot = path.resolve(__dirname, '..', '..');
const inPath = path.join(projectRoot, 'generated', 'all_cases.jsonl');
const outDir = path.join(projectRoot, 'generated');
const outPath = path.join(outDir, 'active_cases_branchwise.json');

function addDays(iso, days) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Spec parameter. Change here mirrors the WINDOW_DAYS knob in active_cases_agg_spec.txt.
const WINDOW_DAYS = 14;

const REF_DATE     = process.env.REPORT_TODAY || new Date().toISOString().slice(0, 10);
const WINDOW_START = addDays(REF_DATE, -(WINDOW_DAYS - 1));   // inclusive lower bound of cal_date enumeration
const ARM_A_START  = addDays(REF_DATE, -89);                  // inclusive lower bound for arm A (recent-and-pending)

const calDates = [];
for (let i = WINDOW_DAYS - 1; i >= 0; i--) calDates.push(addDays(REF_DATE, -i));   // oldest first

// Bucket keyed by "calDate||branchCode".
const buckets = new Map();
function getBucket(calDate, rec) {
  const key = calDate + '||' + rec.branchCode;
  let b = buckets.get(key);
  if (!b) {
    b = {
      branchCode: rec.branchCode,
      branchName: rec.branchName,
      divisionName: rec.divisionName,
      doCode: rec.doCode,
      Zone: rec.Zone,
      cal_date: calDate,
      pendingDocuments: 0,
      submittedDocuments: 0,
      processedDocuments: 0,
      perApprover: new Map()
    };
    buckets.set(key, b);
  }
  return b;
}

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(inPath, { encoding: 'utf8' }),
    crlfDelay: Infinity
  });

  let lines = 0, selected = 0, selectedA = 0, selectedB = 0;

  for await (const line of rl) {
    if (!line) continue;
    lines++;
    const rec = JSON.parse(line);

    // ---- Case selection (evaluated once per case, at REF_DATE) ----
    let hasPending = false, hasRecentAction = false;
    for (const d of rec.documents) {
      if (d.status === 'pending') hasPending = true;
      if (d.actionOn && d.actionOn >= WINDOW_START && d.actionOn <= REF_DATE) hasRecentAction = true;
      if (hasPending && hasRecentAction) break;
    }
    const armA = rec.requestDate >= ARM_A_START && rec.requestDate <= REF_DATE && hasPending;
    const armB = hasRecentAction;
    if (!armA && !armB) continue;
    selected++;
    if (armA) selectedA++;
    if (armB) selectedB++;

    // ---- Per-document contributions ----
    for (const d of rec.documents) {
      // submittedDocuments (rule 4): single cal_date = d.uploadedOn.
      if (d.uploadedOn >= WINDOW_START && d.uploadedOn <= REF_DATE) {
        getBucket(d.uploadedOn, rec).submittedDocuments++;
      }
      // processedDocuments (rule 5): single cal_date = d.actionOn.
      if (d.status !== 'pending' && d.actionOn >= WINDOW_START && d.actionOn <= REF_DATE) {
        const b = getBucket(d.actionOn, rec);
        b.processedDocuments++;
        let entry = b.perApprover.get(d.approvedBy);
        if (!entry) { entry = { accepted: 0, rejected: 0 }; b.perApprover.set(d.approvedBy, entry); }
        if (d.status === 'accepted') entry.accepted++; else entry.rejected++;
      }
      // pendingDocuments (rule 3): walk the WINDOW_DAYS-day window.
      //   cal_date >= d.uploadedOn AND (status == pending OR cal_date < d.actionOn)
      for (const calDate of calDates) {
        if (calDate < d.uploadedOn) continue;
        const stillOpen = (d.status === 'pending') || (calDate < d.actionOn);
        if (stillOpen) getBucket(calDate, rec).pendingDocuments++;
      }
    }
  }

  // ---- Materialize rows: sparse, sorted, with deterministic perApprover order ----
  const rows = [...buckets.values()]
    .filter(b => b.pendingDocuments + b.submittedDocuments + b.processedDocuments > 0)
    .sort((a, b) =>
      a.divisionName.localeCompare(b.divisionName) ||
      a.branchCode.localeCompare(b.branchCode) ||
      a.cal_date.localeCompare(b.cal_date))
    .map((b, i) => ({
      id: i + 1,
      branchCode: b.branchCode,
      branchName: b.branchName,
      divisionName: b.divisionName,
      doCode: b.doCode,
      Zone: b.Zone,
      cal_date: b.cal_date,
      pendingDocuments: b.pendingDocuments,
      submittedDocuments: b.submittedDocuments,
      processedDocuments: b.processedDocuments,
      perApprover: [...b.perApprover.entries()]
        .sort((x, y) => x[0].localeCompare(y[0]))
        .map(([approvedBy, c]) => ({ approvedBy, accepted: c.accepted, rejected: c.rejected }))
    }));

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2) + '\n', 'utf8');

  console.log(`Wrote ${outPath}`);
  console.log(`  REF_DATE=${REF_DATE}  window=[${WINDOW_START} .. ${REF_DATE}]  armAStart=${ARM_A_START}`);
  console.log(`  sourceRecords=${lines}  selectedCases=${selected} (armA=${selectedA} armB=${selectedB})`);
  console.log(`  outputRows=${rows.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
