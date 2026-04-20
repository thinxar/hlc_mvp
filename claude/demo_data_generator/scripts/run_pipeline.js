#!/usr/bin/env node
// Runs the full data pipeline per specs/pipeline/run_order_spec.txt.
// Sequential execution: Stage 1 (reference) -> Stage 2 (case gen) -> Stage 3 (aggregations).
//
// Usage:
//   node scripts/run_pipeline.js                     # uses system date
//   node scripts/run_pipeline.js 2026-04-19          # pin both dates
//   GEN_TODAY=2026-04-19 REPORT_TODAY=2026-04-19 node scripts/run_pipeline.js
//   SKIP_STAGE_0=1 node scripts/run_pipeline.js      # reuse existing generated/branch.csv
//   SKIP_STAGE_1=1 node scripts/run_pipeline.js      # skip reference extractions
//   SKIP_STAGE_2=1 node scripts/run_pipeline.js      # reuse existing generated/all_cases.jsonl

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Positional arg overrides both env vars if provided.
const dateArg = process.argv[2];
if (dateArg) {
  process.env.GEN_TODAY = dateArg;
  process.env.REPORT_TODAY = dateArg;
}
// Mirror one env to the other if only one is set (see run_order_spec.txt).
if (process.env.GEN_TODAY && !process.env.REPORT_TODAY) {
  process.env.REPORT_TODAY = process.env.GEN_TODAY;
}
if (process.env.REPORT_TODAY && !process.env.GEN_TODAY) {
  process.env.GEN_TODAY = process.env.REPORT_TODAY;
}

const skipStage0 = process.env.SKIP_STAGE_0 === '1';
const skipStage1 = process.env.SKIP_STAGE_1 === '1';
const skipStage2 = process.env.SKIP_STAGE_2 === '1';

function run(label, scriptRelPath) {
  const start = Date.now();
  console.log(`>>> [${label}] node ${scriptRelPath}`);
  const result = spawnSync(process.execPath, [scriptRelPath], {
    stdio: 'inherit',
    env: process.env,
    cwd: projectRoot
  });
  if (result.status !== 0) {
    const code = result.status == null ? `signal=${result.signal}` : `exit=${result.status}`;
    console.error(`!!! [${label}] failed (${code}); aborting pipeline.`);
    process.exit(result.status || 1);
  }
  const ms = Date.now() - start;
  console.log(`<<< [${label}] ok (${(ms / 1000).toFixed(1)}s)\n`);
}

console.log('=== palm-demo data pipeline ===');
console.log(`project root : ${projectRoot}`);
console.log(`GEN_TODAY    : ${process.env.GEN_TODAY || '<system date>'}`);
console.log(`REPORT_TODAY : ${process.env.REPORT_TODAY || '<system date>'}`);
console.log();

// Stage 0 - cleanse master CSV (prerequisite for Stages 1 and 2)
if (!skipStage0) {
  run('stage0 cleanse', 'scripts/cleansing/cleanse_branch_csv.js');
} else {
  console.log('--- skipping Stage 0 (SKIP_STAGE_0=1); reusing generated/branch.csv ---\n');
  if (!fs.existsSync(path.join(projectRoot, 'generated', 'branch.csv'))) {
    console.error('!! generated/branch.csv missing; Stages 1 and 2 will fail. Rerun without SKIP_STAGE_0.');
    process.exit(1);
  }
}

// Stage 1 - reference data
if (!skipStage1) {
  run('stage1 branches',       'scripts/reference_data/extract_branches.js');
  run('stage1 zone_divisions', 'scripts/reference_data/extract_zone_divisions.js');
} else {
  console.log(`--- skipping Stage 1 (SKIP_STAGE_1=1) ---\n`);
}

// Stage 2 - case generation
if (!skipStage2) {
  run('stage2 all_cases', 'scripts/data_gen/generate_all_cases.js');
} else {
  console.log('--- skipping Stage 2 (SKIP_STAGE_2=1); reusing generated/all_cases.jsonl ---\n');
  if (!fs.existsSync(path.join(projectRoot, 'generated', 'all_cases.jsonl'))) {
    console.error('!! generated/all_cases.jsonl missing; Stage 3 will fail. Rerun without SKIP_STAGE_2.');
    process.exit(1);
  }
}

// Stage 3 - aggregations (independent of each other; run sequentially for simpler logs)
run('stage3 daily',   'scripts/aggregated/generate_active_cases_daily_branchwise.js');
run('stage3 weekly',  'scripts/aggregated/generate_active_cases_weekly_branchwise.js');
run('stage3 monthly', 'scripts/aggregated/generate_active_cases_monthly_branchwise.js');

console.log('=== pipeline complete ===');
