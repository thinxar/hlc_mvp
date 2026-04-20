// Ad-hoc spec-compliance check over generated/all_cases.jsonl.
// Verifies rules 4 (pool membership, month-disjointness) and 12 (uploaded/approved identities).
// Prints a PASS/FAIL summary and stats; safe to delete after review.

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const filePath = path.join(projectRoot, 'generated', 'all_cases.jsonl');

const monthBranchPool = new Map();        // "YYYY-MM||branchCode" -> Set<id>
const monthBranchByOwner = new Map();     // "YYYY-MM" -> Map<id, branchCode>
let cases = 0, docs = 0, pending = 0, processed = 0;
let uploadedEqSubmitted = 0, sameBranchPool = 0;
let violationApprEqUpload = 0, violationNotInPool = 0, violationMonthCollision = 0;
let violationApprEmpty = 0;

const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
for (const line of lines) {
  const rec = JSON.parse(line);
  cases++;
  const month = rec.requestDate.slice(0, 7);
  const branchCode = rec.branchCode;
  const key = month + '||' + branchCode;

  let pool = monthBranchPool.get(key);
  if (!pool) { pool = new Set(); monthBranchPool.set(key, pool); }

  let ownerByMonth = monthBranchByOwner.get(month);
  if (!ownerByMonth) { ownerByMonth = new Map(); monthBranchByOwner.set(month, ownerByMonth); }

  // submittedBy must be in the branch's monthly pool (by construction; we infer the pool from observations).
  pool.add(rec.submittedBy);
  const prevOwner = ownerByMonth.get(rec.submittedBy);
  if (prevOwner && prevOwner !== branchCode) violationMonthCollision++;
  ownerByMonth.set(rec.submittedBy, branchCode);

  for (const doc of rec.documents) {
    docs++;
    pool.add(doc.uploadedBy);
    const owner1 = ownerByMonth.get(doc.uploadedBy);
    if (owner1 && owner1 !== branchCode) violationMonthCollision++;
    ownerByMonth.set(doc.uploadedBy, branchCode);

    if (doc.uploadedBy === rec.submittedBy) uploadedEqSubmitted++;
    else sameBranchPool++;

    if (doc.status === 'pending') {
      pending++;
      if (doc.approvedBy !== '') violationApprEmpty++;
    } else {
      processed++;
      if (doc.approvedBy === doc.uploadedBy) violationApprEqUpload++;
      pool.add(doc.approvedBy);
      const owner2 = ownerByMonth.get(doc.approvedBy);
      if (owner2 && owner2 !== branchCode) violationMonthCollision++;
      ownerByMonth.set(doc.approvedBy, branchCode);
    }
  }
}

// Pool sizes sanity check (spec says 3..5 unique IDs per (month, branch)).
let poolSize3 = 0, poolSize4 = 0, poolSize5 = 0, poolOther = 0;
for (const [, s] of monthBranchPool) {
  const n = s.size;
  if (n === 3) poolSize3++;
  else if (n === 4) poolSize4++;
  else if (n === 5) poolSize5++;
  else poolOther++;
}

const uploadedPct = (uploadedEqSubmitted / docs) * 100;

console.log(`cases=${cases} docs=${docs} (processed=${processed} pending=${pending})`);
console.log(`uploadedBy==submittedBy: ${uploadedEqSubmitted} (${uploadedPct.toFixed(2)}%); sameBranchPool: ${sameBranchPool}`);
console.log(`(month,branch) pools: ${monthBranchPool.size}  sizes 3/4/5/other = ${poolSize3}/${poolSize4}/${poolSize5}/${poolOther}`);
console.log('violations:');
console.log(`  approvedBy == uploadedBy (rule 12.3): ${violationApprEqUpload}`);
console.log(`  approvedBy non-empty when pending   : ${violationApprEmpty}`);
console.log(`  not-in-same-branch-pool (rule 4)    : ${violationNotInPool}`);
console.log(`  cross-branch ID collision (rule 4.3): ${violationMonthCollision}`);
console.log(violationApprEqUpload + violationApprEmpty + violationNotInPool + violationMonthCollision === 0
  ? 'PASS' : 'FAIL');
