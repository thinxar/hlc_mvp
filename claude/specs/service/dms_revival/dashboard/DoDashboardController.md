# DoDashboardController — Specification

Dashboard endpoints for the **DO (Divisional Office) view** of the
Revival feature.

* Four **branch-ranking** endpoints rank branches under a given DO
  over a rolling month window; they differ only in the metric used
  to compute the ranking — processed (work done), pending (backlog),
  submitted (intake), or ratio (processed share of processed+pending,
  expressed as a percentage). See §2.
* One **aging-bucket** endpoint rolls up the age distribution of
  pending documents for the given DO across the same window into a
  single summary card. See §3.

**Module**: `mongo-service/service/dms-revival`
**Controller**: `com.palmyralabs.dms.revival.controller.DoDashboardController`
**Services**:
* `com.palmyralabs.dms.revival.service.DoDashboardService` — branch-level endpoints (§2).
* `com.palmyralabs.dms.revival.service.DoSummaryService` — DO-level rollups (§3 aging, §4 division performance).
* `com.palmyralabs.dms.revival.service.DoAggregationUtils` (package-private) — shared `matchStage` / `round2` helpers used by both services.

---

## 1. Routing

Class-level mapping:

```
@RequestMapping(path = "${palmyra.servlet.prefix-path:palmyra}/rev")
```

Combined with the Jetty servlet context (`/api`) and the default
prefix (`palmyra`), the endpoints live under `/api/palmyra/rev/do/…`.

| Method                | HTTP verb | Path                    | Purpose                                      |
| --------------------- | --------- | ----------------------- | -------------------------------------------- |
| `getBranchProcessed`  | GET       | `/do/branch/processed`  | Rank branches by `processedDocuments`        |
| `getBranchPending`    | GET       | `/do/branch/pending`    | Rank branches by `pendingDocuments`          |
| `getBranchSubmitted`  | GET       | `/do/branch/submitted`  | Rank branches by `submittedDocuments`        |
| `getBranchPendingRatio`   | GET   | `/do/branch/pending/ratio`   | Rank branches by pending-ratio (`pending / (processed + pending)`) |
| `getBranchProcessedRatio` | GET   | `/do/branch/processed/ratio` | Rank branches by processed-ratio (`processed / (processed + pending)`) |
| `listBranches`        | GET       | `/do/branches`          | Table-view branch list (all three sums)      |
| `listDivisionPerformance` | GET   | `/do/division/performance` | Per-month, per-division counts + pending / processed % |
| `getDivisionOverview` | GET       | `/do/division/overview` | DO-level branch / case / document scorecard  |
| `getAgingBuckets`     | GET       | `/do/aging`             | DO-level aging bucket rollup                 |

The four branch-ranking endpoints share the same query parameters,
response element type, validation rules, and `$match → $group →
$project` stages. The first three push `$sort + $limit` into Mongo;
the two `/ratio` endpoints derive `ratioPercent` per row in Java after
the group, sorts in Java, then slices to `count` (see §8). The
`/do/branches` list endpoint (§2.5) reuses the same match/group/project
helpers but takes a column-name `orderBy` with smart default
direction and a `limit` with a `-1` "off" sentinel, instead of the
`order` / `count` shape shared by the rankers. `/do/aging` groups
by `doCode` into a single object and shares only the `$match`
stage with the rankers (see §3 / §8.2).

---

## 2. Endpoints

### 2.1 Branch processed ranking

`GET /rev/do/branch/processed`

Returns up to `count` branches under `doCode`, ranked by total
`processedDocuments` across the last `window` month(s) of the
`active_cases_monthly_branchwise` collection.

### 2.2 Branch pending ranking (by backlog)

`GET /rev/do/branch/pending`

Returns up to `count` branches under `doCode`, ranked by total
`pendingDocuments` across the same window. Intended for the DO tile
that surfaces the biggest (or smallest) backlogs.

### 2.3 Branch submitted ranking (by intake)

`GET /rev/do/branch/submitted`

Returns up to `count` branches under `doCode`, ranked by total
`submittedDocuments` across the same window. Intended for the DO
tile that surfaces the highest-intake (or lowest-intake) branches.

### 2.4 Branch ratio rankings

Two sibling endpoints, one per ratio formula. Both share the same
request shape, pipeline, and response shape as the other ranking
endpoints (§2.6 / §2.7) — they differ only in which formula feeds
the shared `ratioPercent` field.

#### 2.4.1 `GET /rev/do/branch/pending/ratio`

Returns up to `count` branches under `doCode`, ranked by their
**pending ratio** — the share of processed + pending that is
still outstanding — expressed as a percentage in the range
`[0.0, 100.0]`. Computed on the aggregated sums after `$group`:

```
ratioPercent = 100 * sum(pendingDocuments) /
               ( sum(processedDocuments) + sum(pendingDocuments) )
```

Intended for the DO tile that surfaces branches with the highest
(or lowest) backlog share across the window.

#### 2.4.2 `GET /rev/do/branch/processed/ratio`

Returns up to `count` branches under `doCode`, ranked by their
**processed ratio** (completion rate) — the share of processed +
pending that is already cleared — expressed as a percentage in the
range `[0.0, 100.0]`. Computed on the same aggregated sums:

```
ratioPercent = 100 * sum(processedDocuments) /
               ( sum(processedDocuments) + sum(pendingDocuments) )
```

Intended for the DO tile that surfaces branches with the highest
(or lowest) completion rate across the window.

#### 2.4.3 Common behaviour

* Both endpoints always return `ratioPercent` in `[0.0, 100.0]`,
  rounded to two decimal places. On any branch-row the two formulas
  are complements: `pendingRatio + processedRatio = 100` (except
  when both source sums are zero — then both are defined as `0.0`,
  not `NaN`; a branch with only submitted-but-not-yet-pending rows
  therefore sorts alongside genuinely inactive branches on both
  endpoints).
* Reused DTO field: `BranchPerformanceModel.ratioPercent` is
  populated by every branch endpoint (§2.1–§2.5), but its meaning
  depends on which endpoint served the row — pending ratio on
  §2.4.1, processed ratio on §2.4.2 and §2.1–§2.3 / §2.5. Keeping
  one field name on the DTO is a deliberate trade-off (no model
  churn, one consistent JSON shape) in exchange for the endpoint-
  dependent semantic.
* `submittedDocuments` does **not** feed either ratio — it is
  surfaced on every row for context but has no effect on ranking.

### 2.5 Branch list (table view)

`GET /rev/do/branches`

Returns every branch under `doCode` that has activity in the
window, with the three document-count sums. Intended to back the
DO dashboard's **branches table** — sortable columns, optional row
cap — rather than a top-N card. Unlike §2.1–2.4 this endpoint has
its own request shape (column-name `orderBy`, `limit` with an
"off" sentinel) rather than the `order`/`count` shape shared by
the ranking endpoints.

Request shape:

| Param     | Type   | Required | Default       | Notes                                                                                                       |
| --------- | ------ | -------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| `doCode`  | string | **yes**  | —             | Exact match on stored `doCode`. Blank / missing → 400.                                                      |
| `limit`   | int    | no       | `15`          | Positive integer → row cap (`$limit`). `-1` → no cap, return every branch in scope. Any other value → 400. |
| `orderBy` | string | no       | `branchName`  | One of `branchName`, `processed`, `submitted`, `pending`. Anything else → 400.                              |
| `window`  | int    | no       | `1`           | Positive integer. Number of months (inclusive of current) to aggregate over.                                |

Window semantics are identical to §2 — `toMonth =
firstOfMonth(LocalDate.now())`, `fromMonth = toMonth.minusMonths(window - 1)`.

Sort direction is fixed by `orderBy`; there is no separate
direction param. The mapping is chosen to match the intuitive "click
a column to see the leaders" UX:

| `orderBy`    | Mongo field           | Direction                |
| ------------ | --------------------- | ------------------------ |
| `branchName` | `branchName`          | ASC (A → Z)              |
| `processed`  | `processedDocuments`  | DESC (most-processed first) |
| `submitted`  | `submittedDocuments`  | DESC (highest-intake first) |
| `pending`    | `pendingDocuments`    | DESC (largest-backlog first) |

A branch with no rows in the window does not appear in the result
(the `$group` skips it). Same caveat as the ranking endpoints.

Response element — shares the `BranchPerformanceModel` shape
described in §2.7 verbatim (including the computed `ratioPercent`
bonus field — callers can ignore it).

### 2.6 Shared request shape

Applies to the four ranking endpoints (§2.1–§2.4). The list
endpoint §2.5 has its own request shape; see that section.

| Param     | Type   | Required | Default | Notes                                                                             |
| --------- | ------ | -------- | ------- | --------------------------------------------------------------------------------- |
| `doCode`  | string | **yes**  | —       | Exact match on stored `doCode`. Blank / missing → 400.                            |
| `order`   | string | no       | `top`   | Case-insensitive; `top` sorts descending (largest-first, the default), anything else (including `bottom`) → ascending (smallest-first). |
| `count`   | int    | no       | `10`    | Positive integer. Caps the number of rows returned (applied as `$limit`).         |
| `window`  | int    | no       | `1`     | Positive integer. Number of months (inclusive of current) to aggregate over.      |

Window semantics — the service snaps `LocalDate.now()` to the 1st of
the month (`toMonth`) and sets `fromMonth = toMonth.minusMonths(window - 1)`.
So `window=1` queries the current month only; `window=3` queries the
current month plus the previous two.

### 2.7 Shared response shape

**Response element** — `BranchPerformanceModel` (wrapped in
`PalmyraResponse<List<…>>`):

```json
{
  "branchCode":         "010A",
  "branchName":         "Chennai Main",
  "processedDocuments": 536,
  "pendingDocuments":   183,
  "submittedDocuments": 594,
  "ratioPercent":       74.55
}
```

* `branchCode` — `_id` of the `$group` stage.
* `branchName` — first observed `branchName` per group (branch code
  is stable in the source, so `$first` is sufficient).
* `processedDocuments` — Σ `processedDocuments` across every monthly
  row in scope for that branch.
* `pendingDocuments` — Σ `pendingDocuments` across the same rows.
* `submittedDocuments` — Σ `submittedDocuments` across the same rows.
* `ratioPercent` — `100 * processedDocuments /
  (processedDocuments + pendingDocuments)`, computed in Java on the
  aggregated sums above, after the pipeline returns. Rounded to
  **two decimal places** via `Math.round(raw * 100) / 100.0` (e.g.
  `74.5454…` → `74.55`). Range `[0.0, 100.0]`; `0.0` when both
  source sums are zero (never `NaN`). Always emitted, not just on
  the `/do/branch/*/ratio` endpoints.
* All four derived fields are emitted on every branch endpoint —
  §2.1–§2.5 — the single aggregation computes all three sums
  regardless of which field drives the sort, and the ratio is a
  trivial post-process on top of them. Callers only pay the extra
  bytes, not an extra round-trip.
* Which field is the sort key and in which direction depends on
  the endpoint:
  * §2.1 `/processed` — sorted on `processedDocuments`, direction
    per `order` (`top`→DESC, `bottom`→ASC).
  * §2.2 `/pending` — sorted on `pendingDocuments`, direction
    per `order`.
  * §2.3 `/submitted` — sorted on `submittedDocuments`, direction
    per `order`.
  * §2.4.1 `/pending/ratio` — sorted on `ratioPercent` (= pending
    share), direction per `order`.
  * §2.4.2 `/processed/ratio` — sorted on `ratioPercent` (= processed
    share), direction per `order`.
  * §2.5 `/branches` — sorted on whichever column `orderBy`
    names; direction is fixed per column (ASC for `branchName`,
    DESC for the three numeric columns). No `order` param.
  List is sliced per `count` (§2.1–§2.4) or `limit` (§2.5) after
  the sort runs. For the ranking endpoints, `bottom` surfaces the
  worst performers / smallest backlogs / lowest ratios; `top`
  surfaces the best / biggest / highest. For §2.5, `limit=-1`
  disables the slice entirely.
* Ties on the sort field are not broken explicitly — Mongo's
  natural ordering applies for the three direct-field endpoints;
  the Java sort on the two `/ratio` endpoints is stable (`List.sort`), so the
  pre-sort order (driven by `$group` output) breaks ties.

**Pending-sum caveat** — `pendingDocuments` on a monthly row is the
end-of-month backlog snapshot, not a flow. Summing across N months
therefore counts a long-pending doc N times (same "pending-months"
semantics as `RevDashBoardController.md` §2.2). With `window=1` the
sum is a clean single-snapshot number; with larger windows the UI
should label the number as "pending-months" to avoid confusion.

---

## 3. Aging-bucket rollup endpoint

`GET /rev/do/aging`

Single-object summary: the age distribution of pending documents
for the given DO across the last `window` month(s). Intended to
back a DO-dashboard card that shows "how old is our backlog."

### 3.1 Request shape

| Param     | Type   | Required | Default | Notes                                                                          |
| --------- | ------ | -------- | ------- | ------------------------------------------------------------------------------ |
| `doCode`  | string | **yes**  | —       | Exact match on stored `doCode`. Blank / missing → 400.                         |
| `window`  | int    | no       | `1`     | Positive integer. Number of months (inclusive of current) to aggregate over.   |

Window semantics are identical to §2 — `toMonth =
firstOfMonth(LocalDate.now())`, `fromMonth = toMonth.minusMonths(window - 1)`.

### 3.2 Response shape

Single `DoAgingBucketModel` object (wrapped in `PalmyraResponse`):

```json
{
  "doCode":           "201",
  "pendingDocuments": 388,
  "d0_5":             120,
  "d6_10":             80,
  "d11_20":            60,
  "d21_30":            50,
  "d31_45":            40,
  "d45plus":           38
}
```

* `doCode` — echoed from the `_id` of the `$group` stage (the
  aggregation groups by `doCode`, which degenerates to a single
  row because the `$match` already narrows to one DO).
* `pendingDocuments` — Σ `pendingDocuments` across every monthly
  row for this DO in scope. Same snapshot-summing caveat as §2.7
  (pending-months for `window > 1`).
* `d0_5` / `d6_10` / `d11_20` / `d21_30` / `d31_45` / `d45plus` —
  Σ of the corresponding `ageingSummary.d*` subfield on each
  monthly row. These are documents-pending-for-N-days counts,
  snapshotted at month-end, so the same pending-months caveat
  applies when `window > 1`.
* When the `$match` returns zero rows (e.g. DO has no activity in
  the window), the service substitutes a zero-filled object with
  the caller's `doCode` — the response never contains `null`
  counts and never returns an empty body.

### 3.3 Invariant

By the source `active_cases_monthly_branchwise` contract,
`pendingDocuments` on each monthly row equals the sum of the six
`ageingSummary.d*` buckets for that same row. The aggregation
preserves that invariant across the rollup:
`pendingDocuments == d0_5 + d6_10 + d11_20 + d21_30 + d31_45 + d45plus`.
Treat a drift as a data-quality signal, not an endpoint bug.

---

## 4. Division-performance endpoint

`GET /rev/do/division/performance`

Per-month, per-division rollup of the three document-count sums
(processed / pending / submitted) plus the two derived percentages
for the given DO across the `window`. Intended to back a DO
dashboard card that shows each division's throughput and completion
ratio month-by-month.

### 4.1 Request shape

| Param     | Type   | Required | Default | Notes                                                                        |
| --------- | ------ | -------- | ------- | ---------------------------------------------------------------------------- |
| `doCode`  | string | **yes**  | —       | Exact match on stored `doCode`. Blank / missing → 400.                       |
| `window`  | int    | no       | `1`     | Positive integer. Number of months (inclusive of current) to aggregate over. |

Window semantics are identical to §2 — `toMonth =
firstOfMonth(LocalDate.now())`, `fromMonth = toMonth.minusMonths(window - 1)`.

### 4.2 Response shape

List of `DivisionPerformanceModel` (wrapped in `PalmyraResponse`):

```json
[
  {
    "calMonth":            "2026-04-01",
    "doCode":              "201",
    "divisionName":        "BHOPAL",
    "processedDocuments":  536,
    "pendingDocuments":    246,
    "submittedDocuments":  594,
    "pendingPercentage":   31.45,
    "processedPercentage": 68.55
  },
  ...
]
```

* `calMonth` — bucket key, first day of the month.
* `doCode` — echoed from the `$match` filter via `$first` on the
  group.
* `divisionName` — the group key alongside `calMonth`; every
  division under the DO that had activity in that month produces
  one row.
* `processedDocuments` — Σ `processedDocuments` across every
  monthly row for this `(calMonth, divisionName)` pair.
* `pendingDocuments` — Σ `pendingDocuments` across the same rows.
* `submittedDocuments` — Σ `submittedDocuments` across the same
  rows. Emitted for context; it does **not** feed either of the
  two percentages (those are derived from processed + pending
  only).
* `pendingPercentage` — `100 * Σpending / (Σprocessed + Σpending)`,
  rounded to 2 decimals. `0.0` when both sums are zero.
* `processedPercentage` — `100 * Σprocessed / (Σprocessed + Σpending)`,
  rounded to 2 decimals. `0.0` when both sums are zero. Complement
  of `pendingPercentage` (`pending% + processed% = 100` except in
  the zero-sum edge case where both are 0).
* Sorted by `calMonth` ASC, then `divisionName` ASC.

### 4.3 Grouping rationale

Literal "group by calMonth" alone would either omit `divisionName`
or populate it via `$first` — meaningless when the DO spans
multiple divisions. The composite key `(calMonth, divisionName)`
keeps `divisionName` deterministic: one row per `(month, division)`
pair. A DO that owns branches in only one division produces
`window` rows; a DO that spans N divisions produces up to
`window × N` rows.

---

## 5. Division-overview endpoint

`GET /rev/do/division/overview`

Single-object DO scorecard: branch count, case count, and the three
document sums across the `window`. Intended to back the header card
on the DO dashboard — five numbers, no time dimension.

### 5.1 Request shape

| Param     | Type   | Required | Default | Notes                                                                        |
| --------- | ------ | -------- | ------- | ---------------------------------------------------------------------------- |
| `doCode`  | string | **yes**  | —       | Exact match on stored `doCode`. Blank / missing → 400.                       |
| `window`  | int    | no       | `1`     | Positive integer. Number of months (inclusive of current) to aggregate over. |

Window semantics are identical to §2 — `toMonth =
firstOfMonth(LocalDate.now())`, `fromMonth = toMonth.minusMonths(window - 1)`.
The case-count time slice is widened to calendar-day bounds covering
the same months: `fromDate = fromMonth`, `toDate = lastDayOfMonth(toMonth)`.
That lines `totalCases` up with the `calMonth` buckets used for the
three document sums.

### 5.2 Response shape

Single `DivisionOverviewModel` object (wrapped in `PalmyraResponse`):

```json
{
  "totalBranches":      42,
  "totalCases":         1834,
  "submittedDocuments": 15820,
  "processedDocuments": 13210,
  "pendingDocuments":   2610
}
```

* `totalBranches` — count of `BranchEntity` rows with the given
  `doCode` (via `BranchRepository.countByDoCode`). Independent of
  `window` — this is the DO's master-data footprint, not an activity
  count.
* `totalCases` — count of `CaseEntity` rows in the `all_cases`
  collection where `doCode = <doCode>` and `requestDate` falls
  inclusively inside `[fromDate, toDate]` (via
  `CaseRepository.countByDoCodeAndRequestDateBetween`). Scales with
  `window`.
* `submittedDocuments` / `processedDocuments` / `pendingDocuments` —
  Σ of the corresponding `MonthWiseReportEntity` scalar across every
  monthly row in the same DO where `calMonth ∈ [fromMonth, toMonth]`.
  Same snapshot-sum semantic as elsewhere: pending in particular is
  pending-months for `window > 1` (see caveat 4).
* All five fields are always emitted. When no data matches, every
  number is `0` — the response is never an empty body.

### 5.3 Data sources (one call per source)

Because the five numbers come from three different collections the
service does not try to stitch them into a single aggregation:

| Field                                              | Source                             | Access path                                                                        |
| -------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| `totalBranches`                                    | `branches`                         | `BranchRepository.countByDoCode(doCode)`                                           |
| `totalCases`                                       | `all_cases`                        | `MongoTemplate.count(...)` on `CaseEntity` with inclusive `requestDate ∈ [fromDate, toDate]` |
| `submittedDocuments` / `processedDocuments` / `pendingDocuments` | `active_cases_monthly_branchwise` | `MongoTemplate.aggregate(...)` via the internal `sumDocumentCounts` helper         |

The aggregation for the three sums is a single `_id: null` `$group`:
see §9.4.

---

## 6. Validation — error responses (400 Bad Request)

The branch-ranking endpoints (§2.1–§2.4) share one validation set;
the list endpoint (§2.5), division endpoint (§4), and aging endpoint
(§3) each have narrower sets.

### 6.1 Branch-ranking endpoints (§2.1–§2.4)

Applies to `/processed`, `/pending`, `/submitted`,
`/pending/ratio`, and `/processed/ratio` identically.

| Condition                            | Message                      |
| ------------------------------------ | ---------------------------- |
| `doCode` null / blank                | `doCode is required`         |
| `count <= 0`                         | `count must be positive`     |
| `window <= 0`                        | `window must be positive`    |

`order` is not validated — the default is `top` (descending); any
non-`top` value silently falls back to `bottom` (ascending).
Unparseable `count` / `window` integers produce Spring's standard
`MethodArgumentTypeMismatchException` → 400.

### 6.2 Branch list endpoint (§2.5)

| Condition                                    | Message                                                              |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `doCode` null / blank                        | `doCode is required`                                                 |
| `limit` is `0` or less than `-1`             | `limit must be -1 (no cap) or a positive integer`                    |
| `window <= 0`                                | `window must be positive`                                            |
| `orderBy` not one of the four allowed values | `orderBy must be one of: branchName, processed, submitted, pending`  |

Unlike §5.1's silent `order` fallback, `orderBy` here is validated
explicitly — the enumeration is narrow enough that a typo is more
likely a client bug than a convenience. Blank / null `orderBy`
falls back to the default `branchName`, not an error.

### 6.3 Division-performance endpoint (§4)

| Condition             | Message                      |
| --------------------- | ---------------------------- |
| `doCode` null / blank | `doCode is required`         |
| `window <= 0`         | `window must be positive`    |

No `count` / `order` / `limit` / `orderBy` on this endpoint.
Unparseable `window` → 400 via Spring's type-mismatch.

### 6.4 Aging-bucket endpoint (§3) / Division-overview endpoint (§5)

(Both take the same two-field input — `doCode` + `window` — and
validate identically.)

| Condition             | Message                      |
| --------------------- | ---------------------------- |
| `doCode` null / blank | `doCode is required`         |
| `window <= 0`         | `window must be positive`    |

No `count` / `order` on this endpoint. Unparseable `window` → 400
via Spring's type-mismatch.

---

## 7. Service contract

Branch-level endpoints — **`DoDashboardService`**:

```java
List<BranchPerformanceModel> getBranchProcessed(
        String doCode, String order, int count, int window);

List<BranchPerformanceModel> getBranchPending(
        String doCode, String order, int count, int window);

List<BranchPerformanceModel> getBranchSubmitted(
        String doCode, String order, int count, int window);

List<BranchPerformanceModel> getBranchPendingRatio(
        String doCode, String order, int count, int window);

List<BranchPerformanceModel> getBranchProcessedRatio(
        String doCode, String order, int count, int window);

List<BranchPerformanceModel> listBranches(
        String doCode, int limit, String orderBy, int window);
```

The three direct-field methods delegate to a private
`rankBranches(doCode, order, count, window, sortField)` helper
that pushes `$sort + $limit` into Mongo. `sortField` is one of
`"processedDocuments"`, `"pendingDocuments"`, `"submittedDocuments"`;
the method does not accept arbitrary fields — the public API surface
is the four named methods.

`getBranchPendingRatio` and `getBranchProcessedRatio` both delegate
to a private `rankBranchesByRatio(doCode, order, count, window, ratioFn)`
helper, parameterised by a `ToDoubleFunction<BranchPerformanceModel>`
that produces the per-row ratio. The helper runs the same
`$match → $group → $project` stages as the direct-field endpoints but
**without** `$sort + $limit`, fills `ratioPercent` on every row by
calling the supplied `ratioFn`, sorts the list in Java by that field
according to `order`, and then slices to `count`. The two public
methods pass `computePendingRatioPercent` (§2.4.1) and
`computeProcessedRatioPercent` (§2.4.2) respectively. All five branch
methods route through the shared `DoAggregationUtils.matchStage`
plus this service's private `groupStage` / `projectStage` builders
so the Mongo query is identical bar the trailing stages; only the
post-aggregation handling differs.

`DoDashboardService` has a `MongoTemplate` injected via constructor
(`@RequiredArgsConstructor`). Responsibilities of `rankBranches`:

* Input validation per §5.1.
* Window resolution: `toMonth = firstOfMonth(LocalDate.now())`;
  `fromMonth = toMonth.minusMonths(window - 1)`.
* Direction resolution: `"top".equalsIgnoreCase(order)` → `DESC`
  (the default), otherwise `ASC` (the `bottom` path).
* Build and run the aggregation against `MonthWiseReportEntity`'s
  collection via `mongoTemplate.aggregate(agg, MonthWiseReportEntity.class,
  BranchPerformanceModel.class)`, summing all three metric fields.
  The three direct-field paths sort on `sortField` and `$limit` in
  Mongo; the ratio path sorts and slices in Java.
* Populate `ratioPercent` on every returned row —
  `computeProcessedRatioPercent(m)` on §2.1 / §2.2 / §2.3 / §2.4.2 / §2.5
  (completion ratio) or `computePendingRatioPercent(m)` on §2.4.1
  (pending ratio).

`listBranches` is a standalone method (no delegation to
`rankBranches`): validates `doCode` / `limit` / `window`, maps the
column-name `orderBy` to a Mongo `sortField` + fixed direction per
the §2.5 table, then runs the shared
`matchStage → groupStage → projectStage → $sort` pipeline, followed
by `$limit` only when `limit > 0`. Returned rows are passed through
`computeProcessedRatioPercent(m)` for DTO consistency with the ranking
endpoints.

DO-level rollup endpoints — **`DoSummaryService`**:

```java
List<DivisionPerformanceModel> listDivisionPerformance(
        String doCode, int window);

DivisionOverviewModel getDivisionOverview(
        String doCode, int window);

DoAgingBucketModel getAgingBuckets(
        String doCode, int window);
```

Extracted into a sibling service so that the branch-level code stays
focused on per-branch ranking and the summary rollups don't pile
additional aggregation shapes onto one class. Both services share
the `DoAggregationUtils.matchStage` / `DoAggregationUtils.round2`
helpers (package-private utility); each owns its own `$group` and
`$project` builders because the shape is endpoint-specific.

`listDivisionPerformance` validates `doCode` / `window`, groups on
composite `(calMonth, divisionName)`, sums processed + pending, and
computes the two percentage fields in Java via
`populateDivisionPercentages` (rounded to 2 decimals via
`DoAggregationUtils.round2`). See §4 / §8.3.

`getAgingBuckets` validates `doCode` / `window`, reuses
`DoAggregationUtils.matchStage`, then runs its own `$group` on
`doCode` summing `pendingDocuments` + the six `ageingSummary.d*`
subfields. Zero-fills a `DoAgingBucketModel` (with `doCode`
echoed) when the aggregation returns no rows.

---

## 8. Data model

Reads the single collection:

| Purpose              | Collection                          | Entity                   | Time-bucket field |
| -------------------- | ----------------------------------- | ------------------------ | ----------------- |
| Monthly active cases | `active_cases_monthly_branchwise`   | `MonthWiseReportEntity`  | `calMonth`        |

Fields consumed here:

* Modelled on `MonthWiseReportEntity`:
  `doCode`, `branchCode`, `branchName`, `calMonth`,
  `processedDocuments`, `pendingDocuments`, `submittedDocuments`.
* **Not modelled on the entity but present in the stored documents
  and read by §3 / §8.2 via dotted-path aggregation:**
  `ageingSummary.d0_5`, `ageingSummary.d6_10`,
  `ageingSummary.d11_20`, `ageingSummary.d21_30`,
  `ageingSummary.d31_45`, `ageingSummary.d45plus`.
  These live in the same monthly rows that
  `AgingSummaryService.getMonthlyAgingSummary` already reads — they
  are set during data load / aggregation and carry the pending-doc
  age-band counts snapshotted at month-end.

`perApprover[]` is unread here but remains part of the stored document.

Shares the UTC-midnight `LocalDate ↔ Date` converter contract
described in `RevDashBoardController.md` §5.2 / §7.1. `calMonth`
comparisons in the `$match` stage rely on that converter.

---

## 9. Aggregation pipeline

Shared match/group/project across all five branch endpoints (§2.1–
§2.5) — no `$unwind`, all three sums computed in the same `$group`:

```
[
  { $match: {
      doCode: <doCode>,
      calMonth: { $gte: <fromMonth>, $lte: <toMonth> }
  }},
  { $group: {
      _id: "$branchCode",
      branchName:         { $first: "$branchName" },
      processedDocuments: { $sum:   "$processedDocuments" },
      pendingDocuments:   { $sum:   "$pendingDocuments" },
      submittedDocuments: { $sum:   "$submittedDocuments" }
  }},
  { $project: {
      _id: 0,
      branchCode: "$_id",
      branchName: 1,
      processedDocuments: 1,
      pendingDocuments: 1,
      submittedDocuments: 1
  }},
  // §2.1 / §2.2 / §2.3 / §2.5 — not present for §2.4:
  { $sort:  { <sortField>: <1 | -1> } },
  // §2.1 / §2.2 / §2.3 / §2.4 — omitted on §2.5 when limit = -1:
  { $limit: <cap> }
]
```

* `<sortField>` — per endpoint:
  * §2.1 → `processedDocuments`
  * §2.2 → `pendingDocuments`
  * §2.3 → `submittedDocuments`
  * §2.5 → whichever column `orderBy` names (`branchName`,
    `processedDocuments`, `submittedDocuments`, `pendingDocuments`)
* `<1 | -1>`:
  * §2.1–§2.3 — `-1` for `order=top` (default), `1` for `order=bottom`.
  * §2.5 — fixed by `orderBy`: `1` for `branchName`, `-1` for the
    three numeric columns. No `order` param.
* `<cap>` — `count` on §2.1–§2.3, `limit` on §2.5. §2.5 drops the
  `$limit` stage entirely when `limit == -1`.
* Sort-then-limit ordering is deliberate for the direct-field
  endpoints — Mongo can use the accumulator output directly; no
  additional index is required on the input collection since the
  `$match` stage already bounds the working set to a single DO
  across ≤ `window` months.
* `ratioPercent` is always added in Java (`computeProcessedRatioPercent(row)`
  on every returned row) before the service returns, regardless of
  endpoint.

### 9.1 Ratio endpoints — Java-side sort & slice

`§2.4.1 /do/branch/pending/ratio` and `§2.4.2 /do/branch/processed/ratio`
both run the same match/group/project stages **without** the
trailing `$sort + $limit`, then route through a private
`rankBranchesByRatio` helper parameterised by a
`ToDoubleFunction<BranchPerformanceModel>`:

1. Fills `ratioPercent` on each row by applying the supplied
   ratio function:
   * `§2.4.1` → `computePendingRatioPercent`
     (`100 * pending / total`, `0.0` when `total == 0`).
   * `§2.4.2` → `computeProcessedRatioPercent`
     (`100 * processed / total`, `0.0` when `total == 0`).
   Both round to two decimal places, with
   `total = processed + pending`.
2. Sorts the list in Java using
   `Comparator.comparingDouble(BranchPerformanceModel::getRatioPercent)`,
   reversed for `order=top`.
3. Slices to `count` via `List.subList(0, count)`.

Pushing the sort into Mongo would require either a `$let` + `$cond`
expression in `$project` (to guard the divide-by-zero case) or a
second `$project` stage on top of the sums. Branch cardinality per
DO is bounded (dozens to low hundreds in practice), so fetching all
groups and sorting in Java is cheaper to read and to maintain. If
DO scale grows past that, revisit with a Mongo-side `$addFields`.

### 9.2 Aging-bucket endpoint

`§3 /do/aging` reuses the shared `matchStage()` but runs its own
`$group` and `$project`:

```
[
  { $match: {
      doCode: <doCode>,
      calMonth: { $gte: <fromMonth>, $lte: <toMonth> }
  }},
  { $group: {
      _id:              "$doCode",
      pendingDocuments: { $sum: "$pendingDocuments" },
      d0_5:             { $sum: "$ageingSummary.d0_5" },
      d6_10:            { $sum: "$ageingSummary.d6_10" },
      d11_20:           { $sum: "$ageingSummary.d11_20" },
      d21_30:           { $sum: "$ageingSummary.d21_30" },
      d31_45:           { $sum: "$ageingSummary.d31_45" },
      d45plus:          { $sum: "$ageingSummary.d45plus" }
  }},
  { $project: {
      _id: 0,
      doCode: "$_id",
      pendingDocuments: 1,
      d0_5: 1, d6_10: 1, d11_20: 1,
      d21_30: 1, d31_45: 1, d45plus: 1
  }}
]
```

* Grouping by `$doCode` (rather than `null`) keeps the DO code on
  the projected row without an extra stage — the `$match` already
  clamps to one `doCode`, so the group collapses to a single doc.
* The `ageingSummary.*` fields are nested under each
  `MonthWiseReportEntity` row in the source collection but are not
  modelled on the Java entity; the aggregation accesses them by
  dotted path, same pattern used by `AgingSummaryService`.
* No `$sort` / `$limit` — the single-row result is returned as-is.
* Empty result → service substitutes a zero-filled
  `DoAgingBucketModel` with `doCode` echoed from the caller.

### 9.3 Division-performance endpoint

`§4 /do/division/performance` reuses `DoAggregationUtils.matchStage()`
but runs a composite `(calMonth, divisionName)` group summing all
three document-count fields:

```
[
  { $match: {
      doCode: <doCode>,
      calMonth: { $gte: <fromMonth>, $lte: <toMonth> }
  }},
  { $group: {
      _id: { calMonth: "$calMonth", divisionName: "$divisionName" },
      doCode:             { $first: "$doCode" },
      processedDocuments: { $sum:   "$processedDocuments" },
      pendingDocuments:   { $sum:   "$pendingDocuments" },
      submittedDocuments: { $sum:   "$submittedDocuments" }
  }},
  { $project: {
      _id: 0,
      doCode: 1,
      calMonth:     "$_id.calMonth",
      divisionName: "$_id.divisionName",
      processedDocuments: 1,
      pendingDocuments: 1,
      submittedDocuments: 1
  }},
  { $sort: { calMonth: 1, divisionName: 1 } }
]
```

* Composite `_id` is the full grouping key so both `calMonth` and
  `divisionName` survive the group; `doCode` is carried via `$first`
  (the `$match` clamps it to one value, so `$first` is deterministic).
* No `$limit` — per-month-per-division cardinality is bounded by
  `window × divisions-under-DO`, typically a handful of rows.
* All three document-count sums are emitted on every row (via the
  DTO's now-public fields).
* Percentages are computed in Java after the aggregation via
  `populateDivisionPercentages`:
  ```
  total = processed + pending          // submitted is not used here
  if total == 0:
      pendingPercentage   = 0.0
      processedPercentage = 0.0
  else:
      pendingPercentage   = round2(100 * pending   / total)
      processedPercentage = round2(100 * processed / total)
  ```
  `submittedDocuments` deliberately does **not** feed either
  percentage — only processed and pending make up the in-flight
  work whose completion we're measuring.

### 9.4 Division-overview endpoint

`§5 /do/division/overview` does **not** try to aggregate all five
numbers in one call — the three sources are different collections
and a server-side `$lookup` + union would add complexity for no
payoff. Instead the service fires three independent reads:

1. `branchRepository.countByDoCode(doCode)` →
   `count({ doCode })` on the `branches` collection.
2. `mongoTemplate.count(new Query(Criteria.where("doCode").is(doCode)
     .and("requestDate").gte(fromDate).lte(toDate)), CaseEntity.class)` →
   `count({ doCode, requestDate: { $gte: fromDate, $lte: toDate } })`
   on the `all_cases` collection. Note: Spring Data's
   `...Between` method keyword would expand to **exclusive** `$gt`/`$lt`
   on Mongo, which silently drops cases on the window's boundary
   dates — so the service sidesteps it with an explicit
   `Criteria.gte(...).lte(...)` call. `CaseRepository` remains as an
   empty `MongoRepository<CaseEntity, String>` placeholder for future
   reads.
3. `sumDocumentCounts(doCode, fromMonth, toMonth)` runs the
   following aggregation on `active_cases_monthly_branchwise` and
   returns a single `DocumentSums` row (zero-filled when empty):

   ```
   [
     { $match: {
         doCode: <doCode>,
         calMonth: { $gte: <fromMonth>, $lte: <toMonth> }
     }},
     { $group: {
         _id: null,
         processedDocuments: { $sum: "$processedDocuments" },
         pendingDocuments:   { $sum: "$pendingDocuments" },
         submittedDocuments: { $sum: "$submittedDocuments" }
     }},
     { $project: {
         _id: 0,
         processedDocuments: 1,
         pendingDocuments: 1,
         submittedDocuments: 1
     }}
   ]
   ```

The three results are assembled into a `DivisionOverviewModel`
before the service returns. The case time-slice (`fromDate` /
`toDate`) deliberately uses **calendar-day bounds** that line up
with the monthly buckets driving the three sums — so the two
activity counts (cases vs. documents) refer to the same period.

---

## 10. Example requests

```
# Top 10 branches by processed for DO 201 this month
GET /api/palmyra/rev/do/branch/processed
    ?doCode=201&order=top
# -> [ { "branchCode":         "010A",
#       "branchName":         "Chennai Main",
#       "processedDocuments": 536,
#       "pendingDocuments":   183,
#       "submittedDocuments": 594,
#       "ratioPercent":       74.55 }, ... ]

# Bottom 5 branches by processed for DO 201 over the last 3 months
GET /api/palmyra/rev/do/branch/processed
    ?doCode=201&order=bottom&count=5&window=3

# Top 10 branches by pending backlog for DO 201 this month
GET /api/palmyra/rev/do/branch/pending
    ?doCode=201&order=top

# Smallest 5 pending backlogs for DO 247 this month
GET /api/palmyra/rev/do/branch/pending
    ?doCode=247&order=bottom&count=5

# Pending backlog over a 6-month window (remember: pending-months semantics)
GET /api/palmyra/rev/do/branch/pending
    ?doCode=201&order=top&window=6

# Top 10 branches by submitted (intake) for DO 201 this month
GET /api/palmyra/rev/do/branch/submitted
    ?doCode=201&order=top

# Lowest-intake 5 branches for DO 201 over the last 3 months
GET /api/palmyra/rev/do/branch/submitted
    ?doCode=201&order=bottom&count=5&window=3

# Top 10 branches by pending ratio for DO 201 this month
GET /api/palmyra/rev/do/branch/pending/ratio
    ?doCode=201&order=top
# -> [ { ..., "ratioPercent": 98.72 },   # highest backlog share first
#      { ..., "ratioPercent": 94.23 }, ... ]

# Bottom 5 branches by pending ratio over the last 3 months
GET /api/palmyra/rev/do/branch/pending/ratio
    ?doCode=201&order=bottom&count=5&window=3
# -> [ { ..., "ratioPercent":  0.0 },
#      { ..., "ratioPercent": 12.34 }, ... ]
# Note: branches with zero processed+pending appear at ratio 0.0,
# not as a separate "no activity" marker.

# Top 10 branches by processed ratio (completion rate) for DO 201 this month
GET /api/palmyra/rev/do/branch/processed/ratio
    ?doCode=201&order=top
# -> [ { ..., "ratioPercent": 98.72 },   # highest completion first
#      { ..., "ratioPercent": 94.23 }, ... ]

# Bottom 5 branches by completion rate over the last 3 months
GET /api/palmyra/rev/do/branch/processed/ratio
    ?doCode=201&order=bottom&count=5&window=3
# -> [ { ..., "ratioPercent":  0.0 },
#      { ..., "ratioPercent": 12.34 }, ... ]

# Defaults — top 10 by processed, current month, for DO 247
GET /api/palmyra/rev/do/branch/processed?doCode=247

# Rejected: doCode missing (either endpoint)
GET /api/palmyra/rev/do/branch/pending?order=top
# -> 400 (Spring: missing required request parameter 'doCode')

# Rejected: non-positive count
GET /api/palmyra/rev/do/branch/processed?doCode=201&count=0
# -> 400 "count must be positive"

# Branch list (table view) — defaults: first 15 rows, alphabetical by branchName, current month
GET /api/palmyra/rev/do/branches?doCode=201

# Branch list — every branch in scope, no cap, last 6 months
GET /api/palmyra/rev/do/branches?doCode=201&limit=-1&window=6

# Branch list — top 20 by pending this month
GET /api/palmyra/rev/do/branches
    ?doCode=201&orderBy=pending&limit=20

# Branch list — top 25 by processed over the last 3 months
GET /api/palmyra/rev/do/branches
    ?doCode=201&orderBy=processed&limit=25&window=3

# Rejected: unknown orderBy value
GET /api/palmyra/rev/do/branches?doCode=201&orderBy=revenue
# -> 400 "orderBy must be one of: branchName, processed, submitted, pending"

# Rejected: limit=0 (use -1 to disable the cap)
GET /api/palmyra/rev/do/branches?doCode=201&limit=0
# -> 400 "limit must be -1 (no cap) or a positive integer"

# Division performance — current month for DO 201
GET /api/palmyra/rev/do/division/performance?doCode=201
# -> [ { "calMonth": "2026-04-01", "doCode": "201",
#        "divisionName": "BHOPAL",
#        "processedDocuments": 536,
#        "pendingDocuments":   246,
#        "submittedDocuments": 594,
#        "pendingPercentage":   31.45,
#        "processedPercentage": 68.55 } ]

# Division performance — last 3 months, multi-division DO
GET /api/palmyra/rev/do/division/performance?doCode=201&window=3
# -> list of up to 3 × N rows, sorted by calMonth ASC, divisionName ASC,
#    one per (month, division-with-activity) pair

# Aging-bucket rollup for DO 201 this month (default window=1)
GET /api/palmyra/rev/do/aging?doCode=201
# -> { "doCode": "201", "pendingDocuments": 388,
#      "d0_5": 120, "d6_10": 80, "d11_20": 60,
#      "d21_30": 50, "d31_45": 40, "d45plus": 38 }

# Aging-bucket rollup over the last 6 months
GET /api/palmyra/rev/do/aging?doCode=201&window=6

# Aging — DO with no activity in the window (zero-filled response)
GET /api/palmyra/rev/do/aging?doCode=999
# -> { "doCode": "999", "pendingDocuments": 0,
#      "d0_5": 0, "d6_10": 0, "d11_20": 0,
#      "d21_30": 0, "d31_45": 0, "d45plus": 0 }

# Rejected: aging without doCode
GET /api/palmyra/rev/do/aging?window=3
# -> 400 (Spring: missing required request parameter 'doCode')
```

---

## 11. Known caveats / open items

1. **System-zone `LocalDate.now()`** — `toMonth` is derived from the
   JVM's local date. Same UTC-vs-system-zone caveat as
   `RevDashBoardController.md` §9.2. Moot in practice because the
   month boundary is far less sensitive than the day boundary, but
   still worth a `ZoneId` injection if strict determinism is needed.
2. **Ordering is on the aggregated sum only** — a branch with no
   rows in the window simply does not appear in the result (it
   isn't grouped as a "zero" row), regardless of `order` (§2.1–§2.4)
   or `orderBy` (§2.5). This bites hardest on `order=bottom` and on
   §2.5's `orderBy=branchName` / `limit=-1` combinations, where
   callers may expect an A-to-Z roster of *every* branch under the
   DO including the inactive ones. Callers that need an explicit
   zero row for every branch under the DO must `$lookup` from the
   branch master instead.
3. **No `branchCode` filter** — unlike `RevDashBoardController`,
   these endpoints are intentionally DO-wide; the only scope knob
   is `doCode`. If a per-branch drill-down is needed, use
   `RevDashBoardController`'s monthly summary with `branchCode`.
4. **Pending is a snapshot metric** — see §2.7. For `window=1` the
   sum collapses to a single end-of-month snapshot; for `window>1`
   the number is a pending-months aggregate, not a distinct doc
   count. The `/pending` endpoint does not normalize this for the
   caller.
5. **`/do/branches` with `limit=-1` fans out to all DO branches** —
   unlike the ranking endpoints' bounded-`count` behaviour, the
   list endpoint with `limit=-1` returns every branch with activity
   in the window. Fine at current DO cardinality (dozens to low
   hundreds), but any caller that reaches for `-1` should be aware
   the payload size grows linearly with branch count.
6. **All four ranking endpoints share the same match/group/project** — the
   pipeline always computes all three sums. Adding a new direct-
   field sort key (e.g. `approvedDocuments` if the response is
   extended) is a one-line change to `rankBranches`; adding another
   derived-metric ranking (anything computed from the sums, like
   either ratio) just needs a new public method that calls
   `rankBranchesByRatio` with a new `ToDoubleFunction` — shared
   `matchStage()` / `groupStage()` / `projectStage()` helpers keep
   the Mongo query one source of truth. The pending/processed ratio
   split (§2.4.1 / §2.4.2) uses exactly this extension point.
7. **The two `/ratio` endpoints fan out to all DO branches before
   slicing** — unlike `/processed`, `/pending`, `/submitted`,
   neither ratio endpoint pushes `$limit` into Mongo, so their
   working-set size scales with the branch count under the DO
   rather than with `count`. Fine at current cardinality (dozens to
   low hundreds); if DOs ever grow to many thousands of branches,
   move the ratio into a Mongo `$addFields` with `$cond` to restore
   the sort-then-limit optimization.
8. **`ratioPercent` can be misleading for tiny samples** — a branch
   with one processed and zero pending reports `ratioPercent=100.0`
   just as confidently as a branch with 10 000 / 10 000 reports
   `ratioPercent=50.0`. Neither ratio endpoint clamps on a minimum
   sample size; callers that want to de-noise the ranking should
   combine either ratio with `/processed` or `/submitted` on the
   client.
9. **`ageingSummary.*` is accessed via dotted path, not entity
   field** — the subfields are present in the stored monthly
   documents but not modelled on `MonthWiseReportEntity`. A refactor
   that retypes the entity to include `ageingSummary` would let
   `/do/aging` swap the dotted-path `$sum` stages for
   `sum("ageingSummary.d0_5")` via property access and also benefit
   every reader of the collection, but it is out of scope for this
   endpoint alone.
10. **Aging buckets are pending-months under `window > 1`** — the
    same snapshot-sum caveat as §2.7 / caveat 4 applies here. Each
    `ageingSummary.d*` is an end-of-month headcount, so summing
    over N months counts a long-pending doc N times in whichever
    band it was still in at each month-end. `/do/aging` does not
    normalize this; the UI should label the card accordingly.
