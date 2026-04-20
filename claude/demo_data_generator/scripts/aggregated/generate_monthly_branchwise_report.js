// Monthly Branch Case Summary aggregator.
// Spec:   specs/aggregation/monthly_branchwise_agg_spec.txt
// Source: generated/all_cases.jsonl
// Output: generated/monthly_branchwise_report.json  (JSON array)

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT    = path.resolve(__dirname, '..', '..');
const INPUT   = path.join(ROOT, 'generated', 'all_cases.jsonl');
const OUT_DIR = path.join(ROOT, 'generated');
const OUT     = path.join(OUT_DIR, 'monthly_branchwise_report.json');

// Map source document.status (data_spec.txt) -> output field (spec rule 4).
const STATUS_FIELD = {
  accepted: 'approvedDocuments',
  rejected: 'rejectedDocuments',
  pending:  'pendingDocuments'
};

async function main() {
  if (!fs.existsSync(INPUT)) throw new Error('Input not found: ' + INPUT);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // key = `${month}|${branchCode}` -> bucket object
  const buckets = new Map();

  const rl = readline.createInterface({
    input: fs.createReadStream(INPUT, { encoding: 'utf8' }),
    crlfDelay: Infinity
  });

  let recordCount = 0, badLines = 0, skipped = 0, unknownStatus = 0;

  for await (const line of rl) {
    if (!line) continue;
    let rec;
    try { rec = JSON.parse(line); }
    catch { badLines++; continue; }
    recordCount++;

    const ym = (rec.requestDate || '').slice(0, 7);
    const month = ym ? ym + '-01' : '';                      // rule 1: YYYY-MM-01
    const branchCode = rec.branchCode || '';
    if (!month || !branchCode) { skipped++; continue; }

    const key = month + '|' + branchCode;
    let b = buckets.get(key);
    if (!b) {
      b = {
        month,
        zone: rec.Zone || '',                                 // source uses capitalised "Zone"
        divisionName: rec.divisionName || '',
        doCode: rec.doCode || '',
        branchCode,
        branchName: rec.branchName || '',
        no_cases: 0,
        totalDocuments: 0,
        pendingDocuments: 0,
        approvedDocuments: 0,
        rejectedDocuments: 0
      };
      buckets.set(key, b);
    }

    // requestId is globally unique (data_spec rule 10) -> each record is one case.
    b.no_cases += 1;

    const docs = Array.isArray(rec.documents) ? rec.documents : [];
    b.totalDocuments += docs.length;
    for (const d of docs) {
      const f = STATUS_FIELD[d && d.status];
      if (f) b[f] += 1;
      else unknownStatus++;
    }
  }

  // Sort by month ASC, then branchCode ASC (rule 6).
  const rows = [...buckets.values()].sort((a, b) => {
    if (a.month !== b.month) return a.month < b.month ? -1 : 1;
    return a.branchCode < b.branchCode ? -1 : a.branchCode > b.branchCode ? 1 : 0;
  });

  // Stream-write a pretty JSON array so the file stays usable at any size.
  const out = fs.createWriteStream(OUT, { encoding: 'utf8' });
  out.write('[\n');
  rows.forEach((r, i) => {
    out.write('  ' + JSON.stringify(r) + (i === rows.length - 1 ? '\n' : ',\n'));
  });
  out.write(']\n');
  out.end();
  await new Promise(res => out.on('finish', res));

  // Invariant audit (rule 8) + summary.
  let invariantOk = true, totalCases = 0, totalDocs = 0;
  let firstBreak = null;
  for (const r of rows) {
    totalCases += r.no_cases;
    totalDocs  += r.totalDocuments;
    if (r.pendingDocuments + r.approvedDocuments + r.rejectedDocuments !== r.totalDocuments) {
      if (invariantOk) firstBreak = `${r.month}/${r.branchCode}`;
      invariantOk = false;
    }
  }

  console.log(`Wrote ${OUT}`);
  console.log(`  source records=${recordCount}  badLines=${badLines}  skipped=${skipped}  unknownStatus=${unknownStatus}`);
  console.log(`  rows=${rows.length}  cases=${totalCases}  documents=${totalDocs}`);
  if (rows.length) console.log(`  month range: ${rows[0].month} .. ${rows[rows.length - 1].month}`);
  console.log(`  invariant (pending+approved+rejected == totalDocuments): ${invariantOk ? 'OK' : 'FAILED at ' + firstBreak}`);
}

main().catch(e => { console.error(e); process.exit(1); });
