Data Model Specifications - MongoDB collections
================================================

One .txt per collection describing its stored shape. Each file has
the same five sections:

  1. Document schema
  2. Indexes
  3. Relationships
  4. Expected volume
  5. Known caveats


Files
-----
  summary.txt                               one-liner per collection
  branches.txt                              reference catalogue of branches
  zone_divisions.txt                        reference catalogue of (zone, division)
  active_cases_branchwise.txt               14-day daily working-queue rollup
  active_cases_weekly_branchwise.txt        8-week rolling working-queue rollup
  active_cases_monthly_branchwise.txt       24-month calendar working-queue rollup
  all_cases.txt                             master dataset of every request + documents


For the GENERATION algorithm (how fields get filled, how counts are
computed, how the dates are derived), see the sibling directories:

  specs/cleansing/          stage 0 (cleansed branch.csv build)
  specs/reference_data/     stage 1 (branches, zone_divisions)
  specs/data_gen/           stage 2 (all_cases master dataset)
  specs/aggregation/        stage 3 (4 aggregation outputs)
  specs/pipeline/           overall stage ordering + env vars


For the DDL (validators + indexes + migrations), see:

  demoDataGenLoad/mongodb/ddl/01_collections.js     validators
  demoDataGenLoad/mongodb/ddl/02_indexes.js         indexes
  demoDataGenLoad/mongodb/ddl/03_migrate_string_dates.js
                                                    legacy string -> BSON Date


For the Java entities that read these collections, see:

  mongo-service/service/dms-revival/src/main/java/com/palmyralabs/dms/revival/entity/
