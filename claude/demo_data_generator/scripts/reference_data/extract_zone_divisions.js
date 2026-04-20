// Extracts unique (zone, divisionName) pairs from base_data/branch.csv.
// Output: generated/zone_divisions.json (JSON array, sorted zone -> divisionName).
// Spec: specs/reference_data/zone_division_reference_spec.txt

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
const csvPath = path.join(projectRoot, 'generated', 'branch.csv');
const outDir = path.join(projectRoot, 'generated');
const outPath = path.join(outDir, 'zone_divisions.json');

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const header = rows.shift().map(clean);
const idx = name => header.indexOf(name);
const iZone = idx('Zone'), iDiv = idx('Division Name'), iDoCode = idx('doCode');

if ([iZone, iDiv, iDoCode].some(x => x < 0)) {
  throw new Error('branch.csv missing required columns (did cleansing run?). Found: ' + JSON.stringify(header));
}

// Source row number starts at 2 (1 is the header); matches how a spreadsheet would show it.
const seen = new Map();
let skippedBlank = 0;

for (let r = 0; r < rows.length; r++) {
  const raw = rows[r];
  const zone = clean(raw[iZone]);
  const divisionName = clean(raw[iDiv]);
  const doCode = clean(raw[iDoCode]);
  const sourceLine = r + 2;

  if (!zone && !divisionName) { skippedBlank++; continue; }
  if (!zone || !divisionName) {
    throw new Error(
      `Row ${sourceLine}: partial zone/divisionName (zone="${zone}", divisionName="${divisionName}")`
    );
  }

  const key = zone + '\u0000' + divisionName;
  const prior = seen.get(key);
  if (!prior) {
    seen.set(key, { zone, divisionName, doCode });
  } else if (prior.doCode !== doCode) {
    throw new Error(
      `Row ${sourceLine}: conflicting doCode for (${zone}, ${divisionName}): "${prior.doCode}" vs "${doCode}"`
    );
  }
}

const out = [...seen.values()].sort((a, b) =>
  a.zone.localeCompare(b.zone) ||
  a.divisionName.localeCompare(b.divisionName)
);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');

process.stderr.write(
  `wrote ${out.length} zone/division pairs to ${path.relative(projectRoot, outPath)}` +
  ` (blankRows=${skippedBlank})\n`
);
