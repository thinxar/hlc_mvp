# DoDashboardController — Specification

Dashboard endpoints for the **DO (Divisional Office) view** of the
Revival feature. Both endpoints rank branches under a given DO over
a rolling month window; they differ only in the metric used to
compute the ranking — processed (work done) vs. pending (backlog).

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

| Method                | HTTP verb | Path                    | Sum field            |
| --------------------- | --------- | ----------------------- | -------------------- |
| `getBranchProcessed`  | GET       | `/do/branch/processed`  | `processedDocuments` |
| `getBranchPending`    | GET       | `/do/branch/pending`    | `pendingDocuments`   |

Both endpoints share the same query parameters, response element
type, validation rules, and aggregation shape — the only runtime
difference is which source field feeds the `count` accumulator.

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

### 2.3 Shared request shape

| Param     | Type   | Required | Default | Notes                                                                             |
| --------- | ------ | -------- | ------- | --------------------------------------------------------------------------------- |
| `doCode`  | string | **yes**  | —       | Exact match on stored `doCode`. Blank / missing → 400.                            |
| `order`   | string | no       | `top`   | Case-insensitive; `top` sorts descending (largest-first, the default), anything else (including `bottom`) → ascending (smallest-first). |
| `count`   | int    | no       | `10`    | Positive integer. Caps the number of rows returned (applied as `$limit`).         |
| `window`  | int    | no       | `1`     | Positive integer. Number of months (inclusive of current) to aggregate over.      |

Note the name overlap: the **query param** `count` caps the number
of returned rows, while the **response field** `count` holds the
per-branch metric total (see §2.4). They are unrelated.

Window semantics — the service snaps `LocalDate.now()` to the 1st of
the month (`toMonth`) and sets `fromMonth = toMonth.minusMonths(window - 1)`.
So `window=1` queries the current month only; `window=3` queries the
current month plus the previous two.

### 2.4 Shared response shape

**Response element** — `BranchPerformanceModel` (wrapped in
`PalmyraResponse<List<…>>`):

```json
{
  "branchCode": "010A",
  "branchName": "Chennai Main",
  "count":      536
}
```

* `branchCode` — `_id` of the `$group` stage.
* `branchName` — first observed `branchName` per group (branch code
  is stable in the source, so `$first` is sufficient).
* `count` — the aggregated metric total for that branch:
  * On `/do/branch/processed`: Σ `processedDocuments` across every
    monthly row in scope.
  * On `/do/branch/pending`: Σ `pendingDocuments` across the same.
  The field is generic on purpose — each endpoint fixes the meaning
  of `count` in its own contract, so the model stays reusable for
  any future "rank branches by metric X" endpoint.
* List is sliced to the top `count` (query-param) rows after sorting
  on `count` (response-field) per `order` (`bottom` → *smallest*
  first; `top` → *largest* first). For `/processed`, `bottom`
  surfaces the worst performers and `top` the best; for `/pending`,
  `bottom` surfaces the smallest backlogs and `top` the biggest.
* Ties on the `count` field are not broken explicitly — Mongo's
  natural ordering applies.

**Pending-sum caveat** — `pendingDocuments` on a monthly row is the
end-of-month backlog snapshot, not a flow. Summing across N months
therefore counts a long-pending doc N times (same "pending-months"
semantics as `RevDashBoardController.md` §2.2). With `window=1` the
sum is a clean single-snapshot number; with larger windows the UI
should label the number as "pending-months" to avoid confusion.

---

## 3. Validation — error responses (400 Bad Request)

Applies to both endpoints identically.

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
```

Both public methods delegate to a private
`rankBranches(doCode, order, count, window, sumField)` helper —
the single place validation, window resolution, and aggregation are
implemented. The `sumField` argument is either `"processedDocuments"`
or `"pendingDocuments"`; the method does not accept arbitrary
fields — the public API surface is the two named methods.

`DoDashboardService` has a `MongoTemplate` injected via constructor
(`@RequiredArgsConstructor`). Responsibilities of `rankBranches`:

* Input validation per §3.
* Window resolution: `toMonth = firstOfMonth(LocalDate.now())`;
  `fromMonth = toMonth.minusMonths(window - 1)`.
* Direction resolution: `"top".equalsIgnoreCase(order)` → `DESC`
  (the default), otherwise `ASC` (the `bottom` path).
* Build and run the aggregation against `MonthWiseReportEntity`'s
  collection via `mongoTemplate.aggregate(agg, MonthWiseReportEntity.class,
  BranchPerformanceModel.class)`, summing `sumField` as `count`.

---

## 5. Data model

Reads the single collection:

| Purpose              | Collection                          | Entity                   | Time-bucket field |
| -------------------- | ----------------------------------- | ------------------------ | ----------------- |
| Monthly active cases | `active_cases_monthly_branchwise`   | `MonthWiseReportEntity`  | `calMonth`        |

`MonthWiseReportEntity` fields consumed here:
`doCode`, `branchCode`, `branchName`, `calMonth`, and whichever of
`processedDocuments` / `pendingDocuments` the endpoint sums.
`submittedDocuments` / `perApprover[]` are unread but remain part of
the stored document.

Shares the UTC-midnight `LocalDate ↔ Date` converter contract
described in `RevDashBoardController.md` §5.2 / §7.1. `calMonth`
comparisons in the `$match` stage rely on that converter.

---

## 6. Aggregation pipeline

Single shared aggregation — no `$unwind`. Only the `$sum` source
field differs per endpoint:

```
[
  { $match: {
      doCode: <doCode>,
      calMonth: { $gte: <fromMonth>, $lte: <toMonth> }
  }},
  { $group: {
      _id: "$branchCode",
      branchName: { $first: "$branchName" },
      count:      { $sum:   "$<sumField>" }
  }},
  { $project: {
      _id: 0,
      branchCode: "$_id",
      branchName: 1,
      count: 1
  }},
  { $sort:  { count: <1 | -1> } },
  { $limit: <count> }
]
```

* `<sumField>` = `processedDocuments` for §2.1,
  `pendingDocuments` for §2.2.
* `<1 | -1>` = `-1` for `order=top` (default), `1` for `order=bottom`.
* Sort-then-limit ordering is deliberate — Mongo can use the
  accumulator output directly; no additional index is required on
  the input collection since the `$match` stage already bounds the
  working set to a single DO across ≤ `window` months.

---

## 7. Example requests

```
# Top 10 branches by processed for DO 201 this month
GET /api/palmyra/rev/do/branch/processed
    ?doCode=201&order=top
# -> [ { "branchCode": "010A", "branchName": "Chennai Main", "count": 536 }, ... ]

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
4. **Pending is a snapshot metric** — see §2.4. For `window=1` the
   sum collapses to a single end-of-month snapshot; for `window>1`
   the number is a pending-months aggregate, not a distinct doc
   count. The `/pending` endpoint does not normalize this for the
   caller.
5. **`count` field name overlaps the query param** — the response
   field `count` is per-row (the aggregated total), while the
   request param `count` is the page cap. Clients that deserialise
   into typed records must be careful not to confuse the two.
