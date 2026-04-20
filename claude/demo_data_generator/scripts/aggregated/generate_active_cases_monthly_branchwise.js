// Aggregator for specs/aggregation/active_cases_monthly_agg_spec.txt.
// Reads generated/all_cases.jsonl, applies case selection at REF_DATE,
// then rolls up one row per (cal_month, branchCode) over the 24-month window.

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const projectRoot = path.resolve(__dirname, '..', '..');
const inPath  = path.join(projectRoot, 'generated', 'all_cases.jsonl');
const outDir  = path.join(projectRoot, 'generated');
const outPath = path.join(outDir, 'active_cases_monthly_branchwise.json');

function addDays(iso, days) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function firstOfMonth(iso) {
  return iso.slice(0, 7) + '-01';
}
function addMonthsToFirst(firstIso, months) {
  // firstIso is YYYY-MM-01.
  const [y, m] = firstIso.split('-').map(Number);
  const total = (y * 12 + (m - 1)) + months;
  const yy = Math.floor(total / 12);
  const mm = total - yy * 12;
  return `${yy}-${String(mm + 1).padStart(2, '0')}-01`;
}
function lastOfMonth(firstIso) {
  return addDays(addMonthsToFirst(firstIso, 1), -1);
}

// Spec parameter - mirrors WINDOW_MONTHS in active_cases_monthly_agg_spec.txt.
const WINDOW_MONTHS = 24;

const REF_DATE = process.env.REPORT_TODAY || new Date().toISOString().slice(0, 10);
const REF_FIRST_OF_MONTH = firstOfMonth(REF_DATE);

// cal_month[0] = current month's first day; cal_month[k] = k months earlier; oldest last.
// Emit in chronological (oldest -> newest) order for ease of bucket iteration.
const calMonths = [];
for (let k = WINDOW_MONTHS - 1; k >= 0; k--) calMonths.push(addMonthsToFirst(REF_FIRST_OF_MONTH, -k));

// month_end(cal_month) = min(last day of that month, REF_DATE). Precompute once.
const monthEnd = new Map();
for (const cm of calMonths) {
  const lastDay = lastOfMonth(cm);
  monthEnd.set(cm, lastDay <= REF_DATE ? lastDay : REF_DATE);
}

// Window lower bound = first day of oldest cal_month. Used only to bound actionOn
// when mapping to a cal_month bucket (rule 4); no case-level selection filter
// applies in the monthly spec.
const WINDOW_START = calMonths[0];

// Map an actionOn date inside the window to the first-of-month (cal_month) it belongs to.
function calMonthFor(actionOn) {
  if (actionOn < WINDOW_START || actionOn > REF_DATE) return null;
  return firstOfMonth(actionOn);
}

const buckets = new Map();  // "calMonth||branchCode" -> bucket
function getBucket(calMonth, rec) {
  const key = calMonth + '||' + rec.branchCode;
  let b = buckets.get(key);
  if (!b) {
    b = {
      branchCode: rec.branchCode,
      branchName: rec.branchName,
      divisionName: rec.divisionName,
      doCode: rec.doCode,
      Zone: rec.Zone,
      cal_month: calMonth,
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

  let lines = 0;

  for await (const line of rl) {
    if (!line) continue;
    lines++;
    const rec = JSON.parse(line);

    for (const d of rec.documents) {
      // submittedDocuments (rule 4): exactly one cal_month = first-of-month of d.uploadedOn.
      if (d.uploadedOn >= WINDOW_START && d.uploadedOn <= REF_DATE) {
        const cm = firstOfMonth(d.uploadedOn);
        getBucket(cm, rec).submittedDocuments++;
      }
      // processedDocuments (rule 5): exactly one cal_month = first-of-month of d.actionOn.
      if (d.status !== 'pending' && d.actionOn >= WINDOW_START && d.actionOn <= REF_DATE) {
        const cm = calMonthFor(d.actionOn);
        if (cm) {
          const b = getBucket(cm, rec);
          b.processedDocuments++;
          let entry = b.perApprover.get(d.approvedBy);
          if (!entry) { entry = { accepted: 0, rejected: 0 }; b.perApprover.set(d.approvedBy, entry); }
          if (d.status === 'accepted') entry.accepted++; else entry.rejected++;
        }
      }
      // pendingDocuments (rule 3): walk every cal_month; snapshot is month_end(cm).
      //   month_end >= d.uploadedOn AND (status == pending OR month_end < d.actionOn)
      for (const cm of calMonths) {
        const asOf = monthEnd.get(cm);
        if (asOf < d.uploadedOn) continue;
        const stillOpen = (d.status === 'pending') || (asOf < d.actionOn);
        if (stillOpen) getBucket(cm, rec).pendingDocuments++;
      }
    }
  }

  const rows = [...buckets.values()]
    .filter(b => b.pendingDocuments + b.submittedDocuments + b.processedDocuments > 0)
    .sort((a, b) =>
      a.divisionName.localeCompare(b.divisionName) ||
      a.branchCode.localeCompare(b.branchCode) ||
      a.cal_month.localeCompare(b.cal_month))
    .map((b, i) => ({
      id: i + 1,
      branchCode: b.branchCode,
      branchName: b.branchName,
      divisionName: b.divisionName,
      doCode: b.doCode,
      Zone: b.Zone,
      cal_month: b.cal_month,
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
  console.log(`  REF_DATE=${REF_DATE}  window=[${WINDOW_START} .. ${REF_DATE}]`);
  console.log(`  WINDOW_MONTHS=${WINDOW_MONTHS}  calMonths: ${calMonths[0]} .. ${calMonths[calMonths.length - 1]}`);
  console.log(`  sourceRecords=${lines}  (no case-selection filter - all cases considered)`);
  console.log(`  outputRows=${rows.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
