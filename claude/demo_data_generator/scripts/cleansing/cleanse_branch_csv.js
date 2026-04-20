// Implements specs/cleansing/branch_cleansing_spec.txt.
// Reads base_data/branch.csv, applies whitespace + division-name
// normalization, assigns doCode per canonical division, writes a
// cleansed CSV at generated/branch.csv.

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const srcPath = path.join(projectRoot, 'base_data', 'branch.csv');
const outDir  = path.join(projectRoot, 'generated');
const outPath = path.join(outDir, 'branch.csv');

// ---------- RFC4180-ish CSV parser / writer ----------
function parseCsv(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
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

function csvCell(v) {
  const s = v == null ? '' : String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const cleanWs = s => (s == null ? '' : s.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim());
const canon   = s => s.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

// ---------- read + parse ----------
const rows = parseCsv(fs.readFileSync(srcPath, 'utf8'));
const rawHeader = rows.shift().map(cleanWs);

// Accept either the raw schema (no doCode) or an already-cleansed schema (doCode present)
// per rule 7 idempotency.
const idx = name => rawHeader.indexOf(name);
const iZone  = idx('Zone'),
      iDiv   = idx('Division Name'),
      iCode  = idx('Branch Code'),
      iName  = idx('Branch Name'),
      iCases = idx('Number of Cases'),
      iDocs  = idx('Documents');

if ([iZone, iDiv, iCode, iName, iCases, iDocs].some(x => x < 0)) {
  throw new Error('branch.csv missing required columns. Found: ' + JSON.stringify(rawHeader));
}

// ---------- pass 1: load, whitespace-normalize, build alias groups ----------
// Group rows by canon(divisionName). For each group, remember the distinct
// raw display spellings seen and their row counts.
const groups = new Map();   // canonKey -> { spellings: Map<display, count>, rows: [rowIdx, ...] }
const parsed = [];

for (const raw of rows) {
  const rec = {
    zone:    cleanWs(raw[iZone]),
    divRaw:  cleanWs(raw[iDiv]),
    code:    cleanWs(raw[iCode]),
    name:    cleanWs(raw[iName]),
    cases:   cleanWs(raw[iCases]),
    docs:    cleanWs(raw[iDocs])
  };
  if (!rec.code) continue;

  const key = canon(rec.divRaw);
  if (!key) continue;     // skip rows with blank/unusable division

  let g = groups.get(key);
  if (!g) { g = { spellings: new Map(), rowIndexes: [] }; groups.set(key, g); }
  g.spellings.set(rec.divRaw, (g.spellings.get(rec.divRaw) || 0) + 1);
  g.rowIndexes.push(parsed.length);
  parsed.push(rec);
}

// ---------- resolve canonical display form per alias group (rule 3) ----------
const canonicalDisplay = new Map();   // canonKey -> chosen display string
for (const [key, g] of groups) {
  const spellings = [...g.spellings.entries()];  // [[display, count], ...]
  // Tie-break step 1: display strings with no interior non-alphanumeric
  // characters (i.e. stripping non-alphanumerics is a no-op). Case is
  // preserved - "Ahmedabad" qualifies, "Ahmedaba d" does not.
  const clean = spellings.filter(([d]) => d === d.replace(/[^A-Za-z0-9]/g, ''));
  let chosen;
  if (clean.length === 1) {
    chosen = clean[0][0];
  } else {
    const pool = clean.length > 1 ? clean : spellings;
    // Tie-break step 2: max row count. Step 3: ASCII-ascending display.
    pool.sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]));
    chosen = pool[0][0];
  }
  canonicalDisplay.set(key, chosen);
}

// ---------- log alias merges (rule 3) ----------
for (const [key, g] of groups) {
  if (g.spellings.size < 2) continue;
  const chosen = canonicalDisplay.get(key);
  const parts = [...g.spellings.entries()]
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .map(([d, n]) => `"${d}" (${n} row${n === 1 ? '' : 's'})`);
  process.stderr.write(`alias merge: ${parts.join(' + ')} -> "${chosen}"\n`);
}

// ---------- assign doCode per canonical division (rule 4) ----------
// Sort by (Zone, divisionName). Each canonical division must belong to
// exactly one Zone - fail loudly if a division straddles zones.
const zoneByDivision = new Map();   // canonical divisionName -> Zone
for (const rec of parsed) {
  const div = canonicalDisplay.get(canon(rec.divRaw));
  const existing = zoneByDivision.get(div);
  if (existing == null) zoneByDivision.set(div, rec.zone);
  else if (existing !== rec.zone) {
    throw new Error(`Canonical division "${div}" appears under multiple zones: "${existing}" and "${rec.zone}". Fix branch.csv or refine canonicalization before proceeding.`);
  }
}
const canonicalOrdered = [...zoneByDivision.entries()]
  .sort(([aDiv, aZone], [bDiv, bZone]) =>
    aZone.localeCompare(bZone) || aDiv.localeCompare(bDiv));
const doCodeOf = new Map();
canonicalOrdered.forEach(([name], i) => {
  const seq = 201 + i;
  doCodeOf.set(name, String(seq));     // widens naturally past 999
});
const canonicalNames = canonicalOrdered.map(([name]) => name);

// ---------- build output rows (rule 5 sort) ----------
let merged = 0;
const outRows = parsed.map(rec => {
  const key = canon(rec.divRaw);
  const canonicalDiv = canonicalDisplay.get(key);
  if (canonicalDiv !== rec.divRaw) merged++;
  return {
    zone: rec.zone,
    division: canonicalDiv,
    doCode: doCodeOf.get(canonicalDiv),
    code: rec.code,
    name: rec.name,
    cases: rec.cases,
    docs: rec.docs
  };
});

outRows.sort((a, b) =>
  a.zone.localeCompare(b.zone) ||
  a.division.localeCompare(b.division) ||
  a.code.localeCompare(b.code));

// ---------- write CSV ----------
fs.mkdirSync(outDir, { recursive: true });
const outHeader = ['Zone', 'Division Name', 'doCode', 'Branch Code', 'Branch Name', 'Number of Cases', 'Documents'];
const lines = [outHeader.map(csvCell).join(',')];
for (const r of outRows) {
  lines.push([r.zone, r.division, r.doCode, r.code, r.name, r.cases, r.docs].map(csvCell).join(','));
}
fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');

console.log(`wrote ${path.relative(projectRoot, outPath)}: rows=${outRows.length} branches=${outRows.length} divisions=${canonicalNames.length} merged=${merged}`);
