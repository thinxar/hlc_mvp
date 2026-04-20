#!/usr/bin/env bash
# Runs the full data pipeline per specs/pipeline/run_order_spec.txt.
# Sequential execution: Stage 1 (reference) -> Stage 2 (case gen) -> Stage 3 (aggregations).
#
# Usage:
#   bash scripts/run_pipeline.sh                # uses system date for GEN_TODAY / REPORT_TODAY
#   bash scripts/run_pipeline.sh 2026-04-19     # pin both dates to the same value
#   GEN_TODAY=2026-04-19 REPORT_TODAY=2026-04-19 bash scripts/run_pipeline.sh   # env override
#   SKIP_STAGE_0=1 bash scripts/run_pipeline.sh # reuse existing generated/branch.csv
#   SKIP_STAGE_1=1 bash scripts/run_pipeline.sh # skip reference extractions
#   SKIP_STAGE_2=1 bash scripts/run_pipeline.sh # reuse existing generated/all_cases.jsonl

set -euo pipefail

# Resolve project root from this script's location (scripts/run_pipeline.sh -> ..).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Positional arg overrides both env vars if provided.
if [ "${1:-}" != "" ]; then
  export GEN_TODAY="$1"
  export REPORT_TODAY="$1"
fi

# If one is set but not the other, mirror it across so they stay aligned
# (see run_order_spec.txt "Env-variable consistency").
if [ "${GEN_TODAY:-}" != "" ] && [ "${REPORT_TODAY:-}" = "" ]; then
  export REPORT_TODAY="$GEN_TODAY"
fi
if [ "${REPORT_TODAY:-}" != "" ] && [ "${GEN_TODAY:-}" = "" ]; then
  export GEN_TODAY="$REPORT_TODAY"
fi

run() {
  local label="$1"; shift
  local start end
  start=$(date +%s)
  echo ">>> [$label] $*"
  "$@"
  end=$(date +%s)
  echo "<<< [$label] ok (${end}s - ${start}s = $((end - start))s)"
  echo
}

echo "=== palm-demo data pipeline ==="
echo "project root : $PROJECT_ROOT"
echo "GEN_TODAY    : ${GEN_TODAY:-<system date>}"
echo "REPORT_TODAY : ${REPORT_TODAY:-<system date>}"
echo

# Stage 0 - cleanse master CSV (prerequisite for Stages 1 and 2)
if [ "${SKIP_STAGE_0:-0}" = "0" ]; then
  run "stage0 cleanse"         node scripts/cleansing/cleanse_branch_csv.js
else
  echo "--- skipping Stage 0 (SKIP_STAGE_0=${SKIP_STAGE_0}); reusing generated/branch.csv ---"
  echo
  if [ ! -f "generated/branch.csv" ]; then
    echo "!! generated/branch.csv missing; Stages 1 and 2 will fail. Rerun without SKIP_STAGE_0." >&2
    exit 1
  fi
fi

# Stage 1 - reference data
if [ "${SKIP_STAGE_1:-0}" = "0" ]; then
  run "stage1 branches"        node scripts/reference_data/extract_branches.js
  run "stage1 zone_divisions"  node scripts/reference_data/extract_zone_divisions.js
else
  echo "--- skipping Stage 1 (SKIP_STAGE_1=${SKIP_STAGE_1}) ---"
  echo
fi

# Stage 2 - case generation (master dataset)
if [ "${SKIP_STAGE_2:-0}" = "0" ]; then
  run "stage2 all_cases"       node scripts/data_gen/generate_all_cases.js
else
  echo "--- skipping Stage 2 (SKIP_STAGE_2=${SKIP_STAGE_2}); reusing generated/all_cases.jsonl ---"
  echo
  if [ ! -f "generated/all_cases.jsonl" ]; then
    echo "!! generated/all_cases.jsonl missing; Stage 3 will fail. Rerun without SKIP_STAGE_2." >&2
    exit 1
  fi
fi

# Stage 3 - aggregations (independent of each other)
run "stage3 daily"   node scripts/aggregated/generate_active_cases_daily_branchwise.js
run "stage3 weekly"  node scripts/aggregated/generate_active_cases_weekly_branchwise.js
run "stage3 monthly" node scripts/aggregated/generate_active_cases_monthly_branchwise.js

echo "=== pipeline complete ==="
