// Aggregator for specs/aggregation/active_cases_weekly_agg_spec.txt.
// Reads generated/all_cases.jsonl, applies case selection at REF_DATE,
// then rolls up one row per (cal_week, branchCode) over the 8-week window.

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const projectRoot = path.resolve(__dirname, '..', '..');
const inPath  = path.join(projectRoot, 'generated', 'all_cases.jsonl');
const outDir  = path.join(projectRoot, 'generated');
const outPath = path.join(outDir, 'active_cases_weekly_branchwise.json');

function addDays(iso, days) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
}

// Spec parameter - mirrors WINDOW_WEEKS in active_cases_weekly_agg_spec.txt.
const WINDOW_WEEKS = 8;
const WEEK_DAYS    = 7;

const REF_DATE     = process.env.REPORT_TODAY || new Date().toISOString().slice(0, 10);
const WINDOW_START = addDays(REF_DATE, -(WEEK_DAYS * WINDOW_WEEKS - 1));   // inclusive lower bound
const ARM_A_START  = addDays(REF_DATE, -89);

// cal_week values: REF_DATE (week 0), REF_DATE - 7 (week 1), ..., REF_DATE - 7*(WINDOW_WEEKS-1).
// Each cal_week is the END date of a 7-day period covering [cal_week - 6, cal_week].
const calWeeks = [];
for (let k = WINDOW_WEEKS - 1; k >= 0; k--) calWeeks.push(addDays(REF_DATE, -WEEK_DAYS * k));

// Map an actionOn date inside the window to its cal_week (the week-end it belongs to).
function calWeekFor(actionOn) {
  const x = daysBetween(actionOn, REF_DATE);     // REF_DATE - actionOn, in days (>= 0 inside window)
  if (x < 0 || x > WEEK_DAYS * WINDOW_WEEKS - 1) return null;
  const k = Math.floor(x / WEEK_DAYS);
  return addDays(REF_DATE, -WEEK_DAYS * k);
}

const buckets = new Map();  // "calWeek||branchCode" -> bucket
function getBucket(calWeek, rec) {
  const key = calWeek + '||' + rec.branchCode;
  let b = buckets.get(key);
  if (!b) {
    b = {
      branchCode: rec.branchCode,
      branchName: rec.branchName,
      divisionName: rec.divisionName,
      doCode: rec.doCode,
      Zone: rec.Zone,
      cal_week: calWeek,
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

    for (const d of rec.documents) {
      // submittedDocuments (rule 4): exactly one cal_week = the week containing d.uploadedOn.
      if (d.uploadedOn >= WINDOW_START && d.uploadedOn <= REF_DATE) {
        const calWeek = calWeekFor(d.uploadedOn);
        if (calWeek) getBucket(calWeek, rec).submittedDocuments++;
      }
      // processedDocuments (rule 5): exactly one cal_week = the week containing d.actionOn.
      if (d.status !== 'pending' && d.actionOn >= WINDOW_START && d.actionOn <= REF_DATE) {
        const calWeek = calWeekFor(d.actionOn);
        if (calWeek) {
          const b = getBucket(calWeek, rec);
          b.processedDocuments++;
          let entry = b.perApprover.get(d.approvedBy);
          if (!entry) { entry = { accepted: 0, rejected: 0 }; b.perApprover.set(d.approvedBy, entry); }
          if (d.status === 'accepted') entry.accepted++; else entry.rejected++;
        }
      }
      // pendingDocuments (rule 3): walk every cal_week in the window.
      //   cal_week >= d.uploadedOn AND (status == pending OR cal_week < d.actionOn)
      for (const calWeek of calWeeks) {
        if (calWeek < d.uploadedOn) continue;
        const stillOpen = (d.status === 'pending') || (calWeek < d.actionOn);
        if (stillOpen) getBucket(calWeek, rec).pendingDocuments++;
      }
    }
  }

  const rows = [...buckets.values()]
    .filter(b => b.pendingDocuments + b.submittedDocuments + b.processedDocuments > 0)
    .sort((a, b) =>
      a.divisionName.localeCompare(b.divisionName) ||
      a.branchCode.localeCompare(b.branchCode) ||
      a.cal_week.localeCompare(b.cal_week))
    .map((b, i) => ({
      id: i + 1,
      branchCode: b.branchCode,
      branchName: b.branchName,
      divisionName: b.divisionName,
      doCode: b.doCode,
      Zone: b.Zone,
      cal_week: b.cal_week,
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
  console.log(`  WINDOW_WEEKS=${WINDOW_WEEKS}  calWeeks=${calWeeks.join(', ')}`);
  console.log(`  sourceRecords=${lines}  selectedCases=${selected} (armA=${selectedA} armB=${selectedB})`);
  console.log(`  outputRows=${rows.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
