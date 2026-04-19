// Generates Policy Revival sample cases for every row in branch.csv,
// following data_spec.txt. Output: NDJSON sorted by requestDate ascending.

const fs = require('fs');
const path = require('path');

// ---------- seeded PRNG (mulberry32) ----------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260419);
const pick = arr => arr[Math.floor(rng() * arr.length)];
const digits = n => Array.from({ length: n }, () => Math.floor(rng() * 10)).join('');
const pad = (v, w) => String(v).padStart(w, '0');

function addDays(iso, days) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
}

// ---------- robust CSV parser (RFC4180-ish, handles embedded newlines) ----------
function parseCsv(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);   // strip BOM
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\r') { /* skip */ }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length && r.some(v => v.trim() !== ''));
}

const clean = s => (s == null ? '' : s.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim());

// ---------- spec constants ----------
const MIN_DOCS = 2, MAX_DOCS = 10;
const TODAY = process.env.GEN_TODAY || new Date().toISOString().slice(0, 10);
const RANGE_START = '2024-04-01';                       // requestDate lower bound (inclusive), per rule 11
const RANGE_DAYS = Math.max(0, daysBetween(RANGE_START, TODAY));

const channels = ['AGENT_PORTAL', 'CUSTOMER_PORTAL', 'BRANCH'];
const productCodes = ['TRAD-ENDOW-15', 'TRAD-ENDOW-20', 'JEEVAN-ANAND', 'MONEY-BACK-25', 'TERM-PLUS-10'];
const docTypes = ['DGH_FORM', 'PAYMENT_RECEIPT', 'ID_PROOF'];

function pendingPctForAge(ageDays) {
  if (ageDays > 180) return 0;               // > 6 months: no pending (collapses into accepted)
  if (ageDays > 90) return 0.07;             // 3-6 months: ~7% (< 10%)
  return 0.40 - (0.25 * ageDays / 90);       // 0-90 days: 40% -> 15%
}
function pickStatus(ageDays, rejectedPct) {
  const r = rng();
  if (r < rejectedPct) return 'rejected';
  const p = pendingPctForAge(ageDays);
  if (p > 0 && r < rejectedPct + p) return 'pending';
  return 'accepted';
}

const SLUGS = {
  DGH_FORM: ['dgh_form_signed', 'declaration_good_health', 'dgh_ref', 'good_health_declaration', 'dgh_attested', 'health_declaration_form'],
  PAYMENT_RECEIPT: ['premium_receipt', 'payment_ack', 'txn_slip', 'renewal_receipt', 'neft_ack', 'upi_payment_ref', 'bank_challan'],
  ID_PROOF: ['aadhaar_copy', 'aadhaar_masked', 'pan_card', 'voter_id', 'passport_scan', 'driving_license', 'ration_card']
};

function fileNameFor(type, idx, policyNumber, dateIso) {
  const slug = pick(SLUGS[type]);
  const ext = pick(['pdf', 'pdf', 'pdf', 'pdf', 'doc', 'docx', 'jpg']);
  const tag = (policyNumber || '').slice(-4);
  switch (Math.floor(rng() * 4)) {
    case 0: return `${slug}_${pad(idx, 6)}.${ext}`;
    case 1: return `${slug}-${tag}-${pad(idx, 5)}.${ext}`;
    case 2: return `${slug}_${(dateIso || '').replace(/-/g, '')}_${pad(idx, 4)}.${ext}`;
    default: return `${tag}_${slug}.${ext}`;
  }
}

// ---------- doc count allocation per branch (rule 8) ----------
function allocateDocCounts(totalDocs, numCases) {
  if (numCases <= 0) return [];
  const counts = new Array(numCases).fill(0);
  if (totalDocs >= MIN_DOCS * numCases) {
    counts.fill(MIN_DOCS);
    let remaining = totalDocs - MIN_DOCS * numCases;
    while (remaining > 0) {
      const i = Math.floor(rng() * numCases);
      if (counts[i] < MAX_DOCS) { counts[i]++; remaining--; }
    }
  } else {
    // fallback: deterministic distribution when doc budget is below the minimum.
    const base = Math.floor(totalDocs / numCases);
    let rem = totalDocs % numCases;
    for (let i = 0; i < numCases; i++) counts[i] = base + (i < rem ? 1 : 0);
  }
  return counts;
}

// ---------- main ----------
const csvPath = path.join(__dirname, 'branch.csv');
const outDir = path.join(__dirname, 'generated');
const outPath = path.join(outDir, 'all_cases.jsonl');
fs.mkdirSync(outDir, { recursive: true });

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const header = rows.shift().map(clean);
const idx = name => header.indexOf(name);
const iZone = idx('Zone'), iDiv = idx('Division Name'), iCode = idx('Branch Code'),
      iName = idx('Branch Name'), iCases = idx('Number of Cases'), iDocs = idx('Documents');

if ([iZone, iDiv, iCode, iName, iCases, iDocs].some(x => x < 0)) {
  throw new Error('branch.csv missing required columns. Found: ' + JSON.stringify(header));
}

let docCounter = 10000;
const allRecords = [];
let totalBranches = 0, totalCases = 0, totalDocs = 0;

for (const raw of rows) {
  const branch = {
    zone: clean(raw[iZone]),
    division: clean(raw[iDiv]),
    code: clean(raw[iCode]),
    name: clean(raw[iName])
  };
  const csvCases = parseInt(clean(raw[iCases]) || '0', 10) || 0;
  const csvDocs  = parseInt(clean(raw[iDocs])  || '0', 10) || 0;
  if (csvCases <= 0 || !branch.code) continue;

  const N = 2 * csvCases;      // rule 1: double the CSV count
  const D = 2 * csvDocs;       // rule 8: double the CSV document budget

  // Per-branch rejected rate: uniform in [3%, 7%] (rule 9).
  const rejectedPct = 0.03 + rng() * 0.04;

  const docCounts = allocateDocCounts(D, N);
  const branchRecords = [];

  for (let i = 0; i < N; i++) {
    // requestDate uniformly distributed across [RANGE_START, TODAY] inclusive (rule 11).
    const ageDays = Math.floor(rng() * (RANGE_DAYS + 1));
    const requestDate          = addDays(TODAY, -ageDays);
    const lapseDate            = addDays(requestDate,        -(30 * (2 + Math.floor(rng() * 13))));
    const lastPremiumPaidDate  = addDays(lapseDate,          -(30 * (5 + Math.floor(rng() *  3))));
    const policyYears          = 3 + Math.floor(rng() * 6);
    const commencementDate     = addDays(lastPremiumPaidDate, -(365 * policyYears));
    const revivalPeriodEndDate = addDays(lapseDate, 365 * 5);
    const policyNumber = digits(9);

    // Per-request action window: all non-pending actionOn values fall inside a
    // 5-day jitter window anchored at requestDate + actionBase, so their
    // max-min spread within this request cannot exceed 5 days (rule: actionOn).
    // actionBase >= 6 keeps actionOn strictly after uploadedOn (which is <= requestDate+5).
    const actionBase = 6 + Math.floor(rng() * 35);                          // 6..40 days from requestDate

    const documents = [];
    for (let d = 0; d < docCounts[i]; d++) {
      const type   = pick(docTypes);
      const status = pickStatus(ageDays, rejectedPct);
      let uploadedOn = addDays(requestDate, 1 + Math.floor(rng() * 5));     // 1-5 days AFTER requestDate
      if (uploadedOn > TODAY) uploadedOn = TODAY;
      let actionOn;
      if (status === 'pending') {
        actionOn = '';                                                      // rule: empty for pending
      } else {
        const jitter = Math.floor(rng() * 6);                               // 0..5 days jitter, spread <= 5
        let candidate = addDays(requestDate, actionBase + jitter);
        if (candidate > TODAY)     candidate = TODAY;                       // never in the future
        if (candidate < uploadedOn) candidate = uploadedOn;                 // monotonicity guard
        actionOn = candidate;
      }
      documents.push({
        name: fileNameFor(type, docCounter, policyNumber, requestDate),
        type,
        status,
        docId: `DOC-${docCounter++}`,
        uploadedOn,
        actionOn
      });
    }

    branchRecords.push({
      requestId: null, // assigned after global sort so IDs flow with requestDate
      requestDate,
      Channel: pick(channels),
      PolicyNumber: policyNumber,
      productCode: pick(productCodes),
      commencementDate,
      lastPremiumPaidDate,
      policyStatus: 'LAPSED',
      lapseDate,
      revivalPeriodEndDate,
      submittedBy: digits(8),
      Zone: branch.zone,
      divisionName: branch.division,
      branchCode: branch.code,
      branchName: branch.name,
      documents
    });
  }

  totalBranches++;
  totalCases += N;
  totalDocs  += branchRecords.reduce((a, r) => a + r.documents.length, 0);
  allRecords.push(...branchRecords);
}

// Global sort by requestDate ascending (stable; preserves creation order for ties).
allRecords.sort((a, b) => (a.requestDate < b.requestDate ? -1
                         : a.requestDate > b.requestDate ?  1 : 0));

// Assign globally-unique requestId in requestDate order: REV-YYYY-NNNNNNN
// where NNNNNNN is a single monotone sequence across all records (widened if needed).
const idWidth = Math.max(7, String(allRecords.length).length);
let g = 0;
for (const rec of allRecords) {
  rec.requestId = `REV-${rec.requestDate.slice(0, 4)}-${pad(++g, idWidth)}`;
}

// Stream-write NDJSON (one record per line).
const out = fs.createWriteStream(outPath, { encoding: 'utf8' });
for (const rec of allRecords) out.write(JSON.stringify(rec) + '\n');
out.end();
out.on('finish', () => {
  console.log(`Wrote ${outPath}`);
  console.log(`  branches=${totalBranches} cases=${totalCases} documents=${totalDocs}`);
  console.log(`  TODAY=${TODAY} requestDate range: ${RANGE_START} .. ${TODAY}`);
  console.log(`  actual: ${allRecords[0].requestDate} .. ${allRecords[allRecords.length - 1].requestDate}`);
});
