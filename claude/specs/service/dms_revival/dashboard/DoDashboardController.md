# DoDashboardController — Specification

Dashboard endpoints for the **DO (Divisional Office) view** of the
Revival feature. The four endpoints rank branches under a given DO
over a rolling month window; they differ only in the metric used to
compute the ranking — processed (work done), pending (backlog),
submitted (intake), or ratio (processed share of processed+pending,
expressed as a percentage).

**Module**: `mongo-service/service/dms-revival`
**Controller**: `com.palmyralabs.dms.revival.controller.DoDashboardController`
**Service**: `com.palmyralabs.dms.revival.service.DoDashboardService`

---

## 1. Routing

Class-level mapping:

```
@RequestMapping(path = "${palmyra.servlet.prefix-path:palmyra}/rev")
```

Combined with the Jetty servlet context (`/api`) and the default
prefix (`palmyra`), the endpoints live under `/api/palmyra/rev/do/…`.

| Method                | HTTP verb | Path                    | Sort field           |
| --------------------- | --------- | ----------------------- | -------------------- |
| `getBranchProcessed`  | GET       | `/do/branch/processed`  | `processedDocuments` |
| `getBranchPending`    | GET       | `/do/branch/pending`    | `pendingDocuments`   |
| `getBranchSubmitted`  | GET       | `/do/branch/submitted`  | `submittedDocuments` |
| `getBranchRatio`      | GET       | `/do/branch/ratio`      | `ratioPercent` (derived; Java-side sort) |

All four endpoints share the same query parameters, response
element type, validation rules, and `$match → $group → $project`
stages. The first three push `$sort + $limit` into Mongo; the
`/ratio` endpoint derives `ratioPercent` per row in Java after the
group, sorts in Java, then slices to `count` (see §6).

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

### 2.4 Branch ratio ranking (by completion rate)

`GET /rev/do/branch/ratio`

Returns up to `count` branches under `doCode`, ranked by their
**completion ratio** — the share of processed + pending that is
already processed — expressed as a percentage in the range
`[0.0, 100.0]`. The per-branch ratio is computed on the aggregated
sums after the `$group` stage:

```
ratioPercent = 100 * sum(processedDocuments) /
               ( sum(processedDocuments) + sum(pendingDocuments) )
```

When both sums are zero the ratio is defined as `0.0` (not
`NaN` / error); a branch with only submitted-but-not-yet-pending
rows will therefore sort alongside genuinely inactive branches.

Intended for the DO tile that surfaces the branches that have
cleared (or failed to clear) the largest share of their in-flight
work across the window. `submittedDocuments` does **not** feed the
ratio — it is surfaced on every row for context but has no effect
on ranking.

### 2.5 Shared request shape

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

### 2.6 Shared response shape

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
  `/do/branch/ratio`.
* All four derived fields are emitted on every endpoint — the
  single aggregation computes all three sums regardless of which
  field drives the sort, and the ratio is a trivial post-process
  on top of them. Callers only pay the extra bytes, not an extra
  round-trip.
* Which field is the sort key is fixed by the endpoint:
  `processedDocuments` for §2.1, `pendingDocuments` for §2.2,
  `submittedDocuments` for §2.3, `ratioPercent` for §2.4.
  List is sliced to the top `count` rows after that sort runs per
  `order` (`bottom` → *smallest* first; `top` → *largest* first).
  For `/processed`, `bottom` surfaces the worst performers and `top`
  the best; for `/pending`, `bottom` surfaces the smallest backlogs
  and `top` the biggest; for `/ratio`, `top` surfaces the branches
  that cleared the largest share of in-flight work.
* Ties on the sort field are not broken explicitly — Mongo's
  natural ordering applies for the three direct-field endpoints;
  the Java sort on `/ratio` is stable (`List.sort`), so the
  pre-sort order (driven by `$group` output) breaks ties.

**Pending-sum caveat** — `pendingDocuments` on a monthly row is the
end-of-month backlog snapshot, not a flow. Summing across N months
therefore counts a long-pending doc N times (same "pending-months"
semantics as `RevDashBoardController.md` §2.2). With `window=1` the
sum is a clean single-snapshot number; with larger windows the UI
should label the number as "pending-months" to avoid confusion.

---

## 3. Validation — error responses (400 Bad Request)

Applies to all four endpoints identically.

| Condition                            | Message                      |
| ------------------------------------ | ---------------------------- |
| `doCode` null / blank                | `doCode is required`         |
| `count <= 0`                         | `count must be positive`     |
| `window <= 0`                        | `window must be positive`    |

`order` is not validated — the default is `top` (descending); any
non-`top` value silently falls back to `bottom` (ascending).
Unparseable `count` / `window` integers produce Spring's standard
`MethodArgumentTypeMismatchException` → 400.

---

## 4. Service contract

```java
List<BranchPerformanceModel> getBranchProcessed(
        String doCode, String order, int count, int window);

List<BranchPerformanceModel> getBranchPending(
        String doCode, String order, int count, int window);

List<BranchPerformanceModel> getBranchSubmitted(
        String doCode, String order, int count, int window);

List<BranchPerformanceModel> getBranchRatio(
        String doCode, String order, int count, int window);
```

The three direct-field methods delegate to a private
`rankBranches(doCode, order, count, window, sortField)` helper
that pushes `$sort + $limit` into Mongo. `sortField` is one of
`"processedDocuments"`, `"pendingDocuments"`, `"submittedDocuments"`;
the method does not accept arbitrary fields — the public API surface
is the four named methods.

`getBranchRatio` takes a different path: it runs the same
`$match → $group → $project` stages but **without** `$sort + $limit`,
populates `ratioPercent` on every row in Java via the shared
`computeRatioPercent(m)` helper, sorts the list by that field
according to `order`, and then slices to `count`. All four methods
route through shared `matchStage` / `groupStage` / `projectStage`
builders so the Mongo query is identical bar the trailing stages;
only the post-aggregation handling differs.

`DoDashboardService` has a `MongoTemplate` injected via constructor
(`@RequiredArgsConstructor`). Responsibilities of `rankBranches`:

* Input validation per §3.
* Window resolution: `toMonth = firstOfMonth(LocalDate.now())`;
  `fromMonth = toMonth.minusMonths(window - 1)`.
* Direction resolution: `"top".equalsIgnoreCase(order)` → `DESC`
  (the default), otherwise `ASC` (the `bottom` path).
* Build and run the aggregation against `MonthWiseReportEntity`'s
  collection via `mongoTemplate.aggregate(agg, MonthWiseReportEntity.class,
  BranchPerformanceModel.class)`, summing all three metric fields.
  The three direct-field paths sort on `sortField` and `$limit` in
  Mongo; the ratio path sorts and slices in Java.
* Populate `ratioPercent` on every returned row via
  `computeRatioPercent(m)` — so `ratioPercent` is always present on
  the DTO regardless of which endpoint served the request.

---

## 5. Data model

Reads the single collection:

| Purpose              | Collection                          | Entity                   | Time-bucket field |
| -------------------- | ----------------------------------- | ------------------------ | ----------------- |
| Monthly active cases | `active_cases_monthly_branchwise`   | `MonthWiseReportEntity`  | `calMonth`        |

`MonthWiseReportEntity` fields consumed here:
`doCode`, `branchCode`, `branchName`, `calMonth`,
`processedDocuments`, `pendingDocuments`, `submittedDocuments`.
`perApprover[]` is unread but remains part of the stored document.

Shares the UTC-midnight `LocalDate ↔ Date` converter contract
described in `RevDashBoardController.md` §5.2 / §7.1. `calMonth`
comparisons in the `$match` stage rely on that converter.

---

## 6. Aggregation pipeline

Shared match/group/project across all four endpoints — no `$unwind`,
all three sums computed in the same `$group`:

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
  // §2.1 / §2.2 / §2.3 only — not present for §2.4:
  { $sort:  { <sortField>: <1 | -1> } },
  { $limit: <count> }
]
```

* `<sortField>` = `processedDocuments` for §2.1,
  `pendingDocuments` for §2.2, `submittedDocuments` for §2.3.
* `<1 | -1>` = `-1` for `order=top` (default), `1` for `order=bottom`.
* Sort-then-limit ordering is deliberate for the direct-field
  endpoints — Mongo can use the accumulator output directly; no
  additional index is required on the input collection since the
  `$match` stage already bounds the working set to a single DO
  across ≤ `window` months.
* `ratioPercent` is always added in Java (`computeRatioPercent(row)`
  on every returned row) before the service returns, regardless of
  endpoint.

### 6.1 Ratio endpoint — Java-side sort & slice

`§2.4 /do/branch/ratio` runs the same match/group/project stages
**without** the trailing `$sort + $limit`, then:

1. Maps each row via `computeRatioPercent(m)` to fill
   `ratioPercent` where
   `ratioPercent = total == 0 ? 0.0 : 100.0 * processed / total`
   rounded to two decimal places, and `total = processed + pending`.
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

---

## 7. Example requests

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

# Top 10 branches by completion ratio for DO 201 this month
GET /api/palmyra/rev/do/branch/ratio
    ?doCode=201&order=top
# -> [ { ..., "ratioPercent": 98.72 },
#      { ..., "ratioPercent": 94.23 }, ... ]

# Bottom 5 branches by completion ratio over the last 3 months
GET /api/palmyra/rev/do/branch/ratio
    ?doCode=201&order=bottom&count=5&window=3
# -> [ { ..., "ratioPercent":  0.0 },
#      { ..., "ratioPercent": 12.34 }, ... ]
# Note: branches with zero processed+pending appear at ratio 0.0,
# not as a separate "no activity" marker.

# Defaults — top 10 by processed, current month, for DO 247
GET /api/palmyra/rev/do/branch/processed?doCode=247

# Rejected: doCode missing (either endpoint)
GET /api/palmyra/rev/do/branch/pending?order=top
# -> 400 (Spring: missing required request parameter 'doCode')

# Rejected: non-positive count
GET /api/palmyra/rev/do/branch/processed?doCode=201&count=0
# -> 400 "count must be positive"
```

---

## 8. Known caveats / open items

1. **System-zone `LocalDate.now()`** — `toMonth` is derived from the
   JVM's local date. Same UTC-vs-system-zone caveat as
   `RevDashBoardController.md` §9.2. Moot in practice because the
   month boundary is far less sensitive than the day boundary, but
   still worth a `ZoneId` injection if strict determinism is needed.
2. **Ordering is on the aggregated sum only** — a branch with no
   rows in the window simply does not appear in the result (it
   isn't grouped as a "zero" row), regardless of `order`. This
   bites hardest on `order=bottom`, where callers may expect to see
   the zero-activity branches surfaced first. Callers that need an
   explicit zero row for every branch under the DO must `$lookup`
   from the branch master instead.
3. **No `branchCode` filter** — unlike `RevDashBoardController`,
   these endpoints are intentionally DO-wide; the only scope knob
   is `doCode`. If a per-branch drill-down is needed, use
   `RevDashBoardController`'s monthly summary with `branchCode`.
4. **Pending is a snapshot metric** — see §2.6. For `window=1` the
   sum collapses to a single end-of-month snapshot; for `window>1`
   the number is a pending-months aggregate, not a distinct doc
   count. The `/pending` endpoint does not normalize this for the
   caller.
5. **All four endpoints share the same match/group/project** — the
   pipeline always computes all three sums. Adding a new direct-
   field sort key (e.g. `approvedDocuments` if the response is
   extended) is a one-line change to `rankBranches`; adding another
   derived-metric ranking (anything computed from the sums, like
   the ratio) just needs a new public method that slots into the
   `/ratio` shape — shared `matchStage()` / `groupStage()` /
   `projectStage()` helpers keep the Mongo query one source of
   truth.
6. **`/ratio` fans out to all DO branches before slicing** — unlike
   `/processed`, `/pending`, `/submitted`, the ratio endpoint does
   not push `$limit` into Mongo, so its working set size scales
   with the branch count under the DO rather than with `count`.
   Fine at current cardinality (dozens to low hundreds); if DOs
   ever grow to many thousands of branches, move the ratio into a
   Mongo `$addFields` with `$cond` to restore the sort-then-limit
   optimization.
7. **`ratioPercent` can be misleading for tiny samples** — a branch
   with one processed and zero pending reports `ratioPercent=100.0`
   just as confidently as a branch with 10 000 / 10 000 reports
   `ratioPercent=50.0`. The endpoint does not clamp on a minimum
   sample size; callers that want to de-noise the ranking should
   combine `/ratio` with `/processed` or `/submitted` on the client.
