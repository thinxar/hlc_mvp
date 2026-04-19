// Extracts unique branch reference data from base_data/branch.csv.
// Output: generated/branches.json (JSON array, sorted zone -> division -> branchCode).
// Spec: specs/reference_data/branch_reference_spec.txt

const fs = require('fs');
const path = require('path');

// RFC4180-ish CSV parser that tolerates embedded newlines inside quoted fields.
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

const clean = s => (s == null ? '' : s.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim());

const projectRoot = path.resolve(__dirname, '..', '..');
const csvPath = path.join(projectRoot, 'base_data', 'branch.csv');
const outDir = path.join(projectRoot, 'generated');
const outPath = path.join(outDir, 'branches.json');

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const header = rows.shift().map(clean);
const idx = name => header.indexOf(name);
const iZone = idx('Zone'), iDiv = idx('Division Name'),
      iCode = idx('Branch Code'), iName = idx('Branch Name');

if ([iZone, iDiv, iCode, iName].some(x => x < 0)) {
  throw new Error('branch.csv missing required columns. Found: ' + JSON.stringify(header));
}

const byCode = new Map();
let duplicates = 0, skippedBlank = 0;

for (const raw of rows) {
  const rec = {
    zone: clean(raw[iZone]),
    divisionName: clean(raw[iDiv]),
    branchCode: clean(raw[iCode]),
    branchName: clean(raw[iName])
  };
  if (!rec.branchCode) { skippedBlank++; continue; }

  const prior = byCode.get(rec.branchCode);
  if (prior) {
    if (prior.zone !== rec.zone || prior.divisionName !== rec.divisionName || prior.branchName !== rec.branchName) {
      throw new Error(
        `Conflicting duplicate branchCode "${rec.branchCode}": ` +
        `first=${JSON.stringify(prior)} vs next=${JSON.stringify(rec)}`
      );
    }
    process.stderr.write(`duplicate branchCode "${rec.branchCode}" - keeping first occurrence\n`);
    duplicates++;
    continue;
  }
  byCode.set(rec.branchCode, rec);
}

const out = [...byCode.values()].sort((a, b) =>
  a.zone.localeCompare(b.zone) ||
  a.divisionName.localeCompare(b.divisionName) ||
  a.branchCode.localeCompare(b.branchCode)
);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');

process.stderr.write(
  `wrote ${out.length} branches to ${path.relative(projectRoot, outPath)}` +
  ` (duplicates=${duplicates}, blankCode=${skippedBlank})\n`
);
