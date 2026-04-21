# RevDashBoardController — Specification

Dashboard summary endpoints for the **Revival** feature. Single path,
discriminated by a `window` query param into six aggregations
(weekly active-cases, monthly active-cases, daily active-cases,
today's approval roll-up with hierarchical drill-down, a six-month
headline scorecard, and a single-bucket approver breakdown).

**Module**: `mongo-service/service/dms-revival`
**Controller**: `com.palmyralabs.dms.revival.controller.RevDashBoardController`
**Service**:    `com.palmyralabs.dms.revival.service.RevDashBoardService`

---

## 1. Routing

Class-level mapping:

```
@RequestMapping(path = "${palmyra.servlet.prefix-path:palmyra}/rev")
```

Combined with the Jetty servlet context (`/api`) and the default prefix
(`palmyra`), all six endpoints live under
`/api/palmyra/rev/overAll/document/summary`. The frontend constant
`ServiceEndpoint.customView.rev.cart.summaryView` holds `/rev/overAll/document/summary`.

Six `@GetMapping` methods share the same path and are selected by
Spring's `params` discriminator on `window`:

| Method                             | Discriminator                            |
| ---------------------------------- | ---------------------------------------- |
| `getWeeklyDocumentSummary`         | `params = "window=weekly"`               |
| `getMonthlyDocumentSummary`        | `params = "window=monthly"`              |
| `getDailyDocumentSummary`          | `params = "window=daily"`                |
| `getTodayApprovalSummary`          | `params = "window=todayApproval"`        |
| `getHeadlineSummary`               | `params = "window=headline"`             |
| `getApproverBreakdown`             | `params = "window=approverBreakdown"`    |

A request with no `window` param (or an unrecognized value) matches
none of the six and returns 404.

---

## 2. Endpoints

All four return `PalmyraResponse<List<…>>`; only the payload element
type and query params differ.

### 2.1 Weekly active-cases summary

`GET /rev/overAll/document/summary?window=weekly`

| Param        | Type              | Required | Notes                                                                          |
| ------------ | ----------------- | -------- | ------------------------------------------------------------------------------ |
| `doCode`     | string            | no       | exact match                                                                    |
| `branchCode` | string            | no       | exact match                                                                    |
| `fromWeek`   | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; snapped to the previous-or-same **Sunday**                       |
| `toWeek`     | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; snapped to the previous-or-same **Sunday** (inclusive)           |

**Response element** — `WeeklyDocumentSummaryModel`:

```json
{
  "calWeek":            "2026-04-19",
  "processedDocuments": 118,
  "approvedDocuments":  112,
  "rejectedDocuments":   6,
  "pendingDocuments":   47,
  "submittedDocuments": 128
}
```

* `calWeek` is the last day of each 7-day rolling window.
* `processedDocuments = approvedDocuments + rejectedDocuments` by the
  source invariant — served from the stored scalar, not recomputed.
* `pendingDocuments` / `submittedDocuments` / `processedDocuments` are
  summed directly from the branch-level scalars across every branch
  that falls in the same `calWeek` within the filter scope.
* `approvedDocuments` / `rejectedDocuments` are the scope-wide totals
  rolled up from each branch's `perApprover[].accepted` / `.rejected`
  (nested `$sum` trick — see §6.1).
* List sorted ascending by `calWeek`.
* **Per-approver breakdown is not included here.** To retrieve the
  per-approver split for a specific bucket, call the `approverBreakdown`
  endpoint (§2.6) with `grain=weekly&date=<any day in the week>`.

### 2.2 Monthly active-cases summary

`GET /rev/overAll/document/summary?window=monthly`

| Param        | Type              | Required | Notes                                                                          |
| ------------ | ----------------- | -------- | ------------------------------------------------------------------------------ |
| `doCode`     | string            | no       | exact match                                                                    |
| `branchCode` | string            | no       | exact match                                                                    |
| `fromMonth`  | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; snapped to the **first day of the month**                        |
| `toMonth`    | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; snapped to the **first day of the month** (inclusive)            |

**Response element** — `MonthlyDocumentSummaryModel`:

```json
{
  "calMonth":           "2026-04-01",
  "processedDocuments": 536,
  "approvedDocuments":  512,
  "rejectedDocuments":   24,
  "pendingDocuments":   183,
  "submittedDocuments": 594
}
```

* `calMonth` is the first day of each calendar month
  (`YYYY-MM-01`).
* `processedDocuments = approvedDocuments + rejectedDocuments` by the
  source invariant — served from the stored scalar, not recomputed.
* `pendingDocuments` / `submittedDocuments` / `processedDocuments` are
  summed directly from the branch-level scalars across every branch
  that falls in the same `calMonth` within the filter scope.
* `approvedDocuments` / `rejectedDocuments` are rolled up from each
  branch's `perApprover[].accepted` / `.rejected` via the nested
  `$sum` trick (§6.1).
* List sorted ascending by `calMonth`.
* No max-interval cap — the monthly collection is small
  (~48k rows) so unbounded queries are permitted.
* **Per-approver breakdown is not included here.** Call
  `approverBreakdown` (§2.6) with `grain=monthly&date=<any day in the
  month>` to retrieve the per-approver split for a specific month.

### 2.3 Daily active-cases summary

`GET /rev/overAll/document/summary?window=daily`

| Param        | Type              | Required | Notes                                           |
| ------------ | ----------------- | -------- | ----------------------------------------------- |
| `doCode`     | string            | no       | exact match                                     |
| `branchCode` | string            | no       | exact match                                     |
| `fromDate`   | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; no normalization (day-granular)   |
| `toDate`     | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; inclusive                         |

**Response element** — `DailyDocumentSummaryModel`:

```json
{
  "calDate":            "2026-04-17",
  "processedDocuments": 45,
  "approvedDocuments":  41,
  "rejectedDocuments":   4,
  "pendingDocuments":    2,
  "submittedDocuments": 41
}
```

* `calDate` is the single day the row summarizes.
* Same roll-up semantics as the weekly / monthly endpoints:
  `pendingDocuments` / `submittedDocuments` / `processedDocuments`
  sum the stored scalars across branches in scope on this `calDate`;
  `approvedDocuments` / `rejectedDocuments` use the nested `$sum`
  trick against `perApprover[]`.
* List sorted ascending by `calDate`.
* **Per-approver breakdown is not included here.** Call
  `approverBreakdown` (§2.6) with `grain=daily&date=<calDate>` for
  the per-approver split on a specific day.

### 2.4 Today's approval summary (hierarchical drill-down)

`GET /rev/overAll/document/summary?window=todayApproval`

Aggregates `active_cases_branchwise` for a **single calendar day** —
the day is supplied via the `date` param. If `date` is omitted the
service falls back to `LocalDate.now()` (server's local date — same
caveat as §9.2) so the out-of-the-box call still behaves as "today's
approval." The grouping dimension is driven by the filter params: the
response groups one level *below* the deepest filter supplied. Zero
filters → zone breakdown; full filter triple → per-SR breakdown inside
that branch.

| Param      | Type              | Required | Notes                                                                                 |
| ---------- | ----------------- | -------- | ------------------------------------------------------------------------------------- |
| `date`     | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; exact match on `calDate`; defaults to `LocalDate.now()` when omitted    |
| `zone`     | string            | no       | exact match on stored `Zone`                                                          |
| `division` | string            | no       | exact match on stored `divisionName`                                                  |
| `branch`   | string            | no       | exact match on stored `branchCode`                                                    |

**Filter → group dimension** (deepest non-blank filter wins; filters
below that level are ignored if supplied alone, see §3):

| Filters present                           | `groupBy` | Group field                     | Populated key fields in response |
| ----------------------------------------- | --------- | ------------------------------- | -------------------------------- |
| *(none)*                                  | `zone`    | `Zone`                          | `zone`                           |
| `zone`                                    | `division`| `divisionName`                  | `zone`, `division`               |
| `zone` + `division`                       | `branch`  | `branchCode` (+ `branchName`)   | `zone`, `division`, `branchCode`, `branchName` |
| `zone` + `division` + `branch`            | `sr`      | `perApprover.approvedBy` ("SR") | `zone`, `division`, `branchCode`, `branchName`, `approvedBy` |

**Response element** — `TodayApprovalSummaryModel`:

```json
{
  "groupBy":            "zone",
  "zone":               "NORTH",
  "division":           null,
  "branchCode":         null,
  "branchName":         null,
  "approvedBy":         null,
  "approvedDocuments":  42,
  "pendingDocuments":   3,
  "rejectedDocuments":  1,
  "processedDocuments": 43
}
```

* `groupBy` echoes the grouping dimension — one of `"zone"`,
  `"division"`, `"branch"`, `"sr"` — so the frontend knows which drill
  step it's rendering without having to reinterpret its own request.
* Only the key fields relevant to the current level (plus any ancestor
  filters) are populated; the rest are `null` and the JSON serializer
  is expected to emit them (no `@JsonInclude(NON_NULL)`) so the shape
  is uniform across levels.
* `processedDocuments = approvedDocuments + rejectedDocuments`,
  computed server-side inside `$project` — same convention as the
  other three endpoints.
* **SR level only**: `pendingDocuments` is reported as `0`. Pending
  docs sit at the document (branch-day) level, not per approver, so
  attributing them to a specific SR is not meaningful. Documented
  caveat, not a bug.
* List is sorted ascending by the active key field (zone name,
  division name, branchCode, approvedBy).

### 2.5 Six-month headline scorecard

`GET /rev/overAll/document/summary?window=headline`

Single-object KPI card: six totals rolled up from the **monthly**
collection over a (default: trailing-six-months) window, plus a
nested three-number snapshot of processed work for one specific day
from the **daily** collection. Intended to back the dashboard header
tiles.

Sources:

* **Part A** — `active_cases_monthly_branchwise` (same fields as
  `DailyBranchWiseReportEntity`, time-bucketed by `calMonth` — see §5).
* **Part B** — `active_cases_branchwise` (daily), one day only.

| Param        | Type              | Required | Drives                 | Notes                                                                                                  |
| ------------ | ----------------- | -------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `fromMonth`  | `LocalDate` (ISO) | no       | Part A (monthly)       | `yyyy-MM-dd`; snapped to 1st of month. Defaults to `firstOfMonth(LocalDate.now()).minusMonths(5)`.     |
| `toMonth`    | `LocalDate` (ISO) | no       | Part A (monthly)       | `yyyy-MM-dd`; snapped to 1st of month, inclusive. Defaults to `firstOfMonth(LocalDate.now())`.         |
| `date`       | `LocalDate` (ISO) | no       | Part B (today section) | `yyyy-MM-dd`; exact match on `calDate`. Defaults to `LocalDate.now()`.                                 |
| `doCode`     | string            | no       | **Both pipelines**     | exact match on stored `doCode`.                                                                        |
| `branchCode` | string            | no       | **Both pipelines**     | exact match on stored `branchCode`.                                                                    |

Param independence:

* `fromMonth` / `toMonth` drive only the six monthly totals.
* `date` drives only the nested `todayProcessed` block.
* `doCode` / `branchCode` clamp **both** pipelines so the whole card
  stays scoped to the same slice of the business.
* Omit everything for the classic "last 6 months + today, all
  branches" default. No hierarchy enforcement on the scope params —
  branchCode alone is a legal filter because it's unique.

One-sided monthly window: if only `fromMonth` is supplied,
`toMonth` defaults to `firstOfMonth(now)`; if only `toMonth` is
supplied, `fromMonth = toMonth.minusMonths(5)` so the window stays
6 months wide but shifts. `fromMonth > toMonth` rejects with 400.

**Response element** — `HeadlineSummaryModel` (**single object, not
a list**):

```json
{
  "totalDocuments":      1234,
  "pendingDocuments":     230,
  "submittedDocuments":   450,
  "processedDocuments":   554,
  "approvedDocuments":    480,
  "rejectedDocuments":     74,
  "todayProcessed": {
    "totalProcessed":      18,
    "approved":            15,
    "rejected":             3
  }
}
```

Field definitions — six-month block:

| Field                | Formula                                                             | Notes                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `totalDocuments`     | Σ (`pendingDocuments + submittedDocuments + processedDocuments`)    | Aggregate "work touched" over the window. The three sub-categories overlap semantically (a doc submitted and processed in the same month contributes to both); this field is deliberately a pure sum, not a distinct count. |
| `pendingDocuments`   | Σ `pendingDocuments`                                                | Pending-**months** metric: each monthly row holds the backlog at month-end, so summing across N months multiplies a long-pending item by N. Document this on the UI tile.                                                      |
| `submittedDocuments` | Σ `submittedDocuments`                                              | Straight sum of uploads per calMonth.                                                                                                        |
| `processedDocuments` | Σ `processedDocuments`                                              | Straight sum of actioned per calMonth. Equal to `approvedDocuments + rejectedDocuments` by the per-doc invariant (§6.4 / data-model spec).   |
| `approvedDocuments`  | Σ (Σ `perApprover.accepted`)                                        | Nested `$sum` — inner sums the approver array on each doc, outer sums across the group.                                                      |
| `rejectedDocuments`  | Σ (Σ `perApprover.rejected`)                                        | Same nested-sum pattern.                                                                                                                     |

Field definitions — `todayProcessed` block:

| Field            | Source                                                      | Notes                                                                                                            |
| ---------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `totalProcessed` | Σ `processedDocuments` on `calDate = <date>`                | Scalar sum — no unwind, no approver math needed.                                                                  |
| `approved`       | Σ (Σ `perApprover.accepted`) on `calDate = <date>`          | Nested sum, same trick as the monthly block.                                                                      |
| `rejected`       | Σ (Σ `perApprover.rejected`) on `calDate = <date>`          | Nested sum.                                                                                                       |

Guarantees:

* All nine fields are always emitted; if the respective pipeline
  returns zero rows the service substitutes `0L`, never `null`.
* `todayProcessed` is always present as a sub-object (never `null`).
* Field name `todayProcessed` keeps the `today` prefix even when
  `date` is a past day — treat it as "processed count for the queried
  day," with today as the default.
* Default `LocalDate.now()` uses the server's local date (same caveat
  as §9's "system-zone `LocalDate.now()`").

### 2.6 Approver breakdown over a date range

`GET /rev/overAll/document/summary?window=approverBreakdown`

Returns the `processedDocuments` total and the per-approver split
aggregated across a **range** of time buckets at the caller-chosen
grain (daily, weekly, or monthly). The range is inclusive on both
ends after the grain's snap rule (so e.g. `fromDate=2026-02-15` with
`grain=monthly` becomes "Feb 2026 onwards"). Carved out of §2.1 /
§2.2 / §2.3 so those list endpoints stay lean — the per-approver
breakdown is only fetched on demand when the UI drills in.

The time window accepts **either** a `fromDate` + `toDate` range
**or** a single `date` shortcut for the common "just this one bucket"
case. When `date` is supplied it wins: both bounds are forced to
`date` and any `fromDate` / `toDate` values on the same request are
ignored.

| Param        | Type              | Required | Notes                                                                                                                                       |
| ------------ | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `grain`      | string            | no       | `daily` \| `weekly` \| `monthly`; defaults to `daily`. Anything else → 400.                                                                  |
| `fromDate`   | `LocalDate` (ISO) | no       | Start of the range (any day — snapped per grain). Defaults to the snapped bucket containing `LocalDate.now()`. Ignored if `date` is present. |
| `toDate`     | `LocalDate` (ISO) | no       | End of the range, inclusive (snapped per grain). Defaults to the snapped bucket containing `LocalDate.now()`. Ignored if `date` is present.  |
| `date`       | `LocalDate` (ISO) | no       | Single-bucket shortcut — sets both `fromDate` and `toDate` to this day (snapped per grain). Takes precedence over `fromDate` / `toDate`.     |
| `doCode`     | string            | no       | exact match on `doCode`.                                                                                                                     |
| `branchCode` | string            | no       | exact match on `branchCode`.                                                                                                                 |

Range resolution — the service snaps each bound independently to the
grain's canonical bucket key before matching. Both bounds share one
snap rule per grain (no directional rounding; the caller is expected
to pass days that already sit inside the intended buckets):

| `grain`   | Collection                          | Snap rule (applied to both `fromDate` and `toDate`) |
| --------- | ----------------------------------- | --------------------------------------------------- |
| `daily`   | `active_cases_branchwise`           | none — `calDate` is day-granular                    |
| `weekly`  | `active_cases_weekly_branchwise`    | `with(previousOrSame(SUNDAY))`                      |
| `monthly` | `active_cases_monthly_branchwise`   | `withDayOfMonth(1)`                                 |

If both bounds are omitted, both default to the snapped bucket for
today; that reproduces the "single current bucket" behaviour the
endpoint had before the range parameters were introduced. If only one
bound is supplied, the other defaults to the snapped bucket for
today. `fromDate > toDate` (after snap) → 400.

**Response element** — `ApproverBreakdownModel` (**single object, not
a list** — the range is aggregated into one breakdown):

```json
{
  "grain":              "monthly",
  "fromBucket":         "2026-02-01",
  "toBucket":           "2026-04-01",
  "processedDocuments": 1650,
  "perApprover": [
    { "approvedBy": "57988792", "approvedCount": 648, "rejectedCount": 32 },
    { "approvedBy": "61230015", "approvedCount": 920, "rejectedCount": 50 }
  ]
}
```

* `grain` echoes the resolved grain (always lowercase) so the caller
  sees what the service actually used.
* `fromBucket` / `toBucket` are the snapped bounds actually applied to
  the `$match`. Lets the client round-trip without re-computing.
* `processedDocuments` is the scope-wide sum of the stored scalar
  across every branch-bucket row in `[fromBucket, toBucket]` — no
  `$unwind` needed.
* `perApprover` is the per-approver breakdown aggregated across the
  whole range and scope. One row per distinct `approvedBy`;
  `approvedCount` = sum of DB `accepted`, `rejectedCount` = sum of DB
  `rejected` (renamed at the API boundary). Sorted ascending by
  `approvedBy`.
* Invariant:
  `sum(perApprover[].approvedCount) + sum(perApprover[].rejectedCount)
  == processedDocuments`.
* Empty range → `processedDocuments = 0` and `perApprover = []`;
  never `null`.
* Unlike §2.1 / §2.2 / §2.3, the response is **not** broken down per
  bucket — if the UI needs per-bucket approver splits, call this
  endpoint once per bucket or use the ranged scalar endpoints together
  with bucket-specific approver calls.

---

## 3. Validation — error responses (400 Bad Request)

| Condition                                                                                   | Example                                                                              |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Unparseable date in any `from*` / `to*` / `date` param                                      | `fromMonth=bogus` or `date=xyz` → Spring `MethodArgumentTypeMismatchException` → 400 |
| Non-ISO date format                                                                         | `fromMonth=2024-5-1` or `date=2026-4-15` → 400 (ISO requires zero-padding)           |
| Weekly interval > **6 months** (after Sunday normalization)                                 | `fromWeek=2025-10-01&toWeek=2026-05-01` → `weekly interval exceeds 6 months (…)`     |
| Daily interval > **2 months**                                                               | `fromDate=2026-01-01&toDate=2026-04-20` → `daily interval exceeds 2 months (…)`      |
| Monthly window has **no interval cap** — unbounded ranges are allowed                       | *(no 400 response — returns the full series)*                                        |
| `todayApproval`: `division` supplied without `zone`                                         | `window=todayApproval&division=X` → `division filter requires zone`                  |
| `todayApproval`: `branch` supplied without `zone` + `division`                              | `window=todayApproval&branch=010A` → `branch filter requires zone and division`      |
| `headline`: `fromMonth` (after snap to 1st) strictly after `toMonth`                        | `window=headline&fromMonth=2026-04-01&toMonth=2026-02-01` → `fromMonth after toMonth`|
| `approverBreakdown`: unrecognized `grain`                                                   | `window=approverBreakdown&grain=hourly` → `grain must be one of: daily, weekly, monthly` |
| `approverBreakdown`: `fromDate` (after grain snap) strictly after `toDate`                  | `window=approverBreakdown&grain=monthly&fromDate=2026-04-01&toDate=2026-02-01` → `fromDate after toDate` |

Interval cap semantics: `to.isAfter(from.plusMonths(N))` rejects.
A range exactly N months wide is allowed.

Cap is skipped if either bound is null — a one-sided or unbounded
query is permitted to fetch the full collection. Tighten via service
if that becomes an issue.

---

## 4. Service contract (summary)

```java
List<WeeklyDocumentSummaryModel>  getWeeklyDocumentSummary(
        String doCode, String branchCode, LocalDate fromWeek, LocalDate toWeek);

List<MonthlyDocumentSummaryModel> getMonthlyDocumentSummary(
        String doCode, String branchCode, LocalDate fromMonth, LocalDate toMonth);

List<DailyDocumentSummaryModel>   getDailyDocumentSummary(
        String doCode, String branchCode, LocalDate fromDate, LocalDate toDate);

List<TodayApprovalSummaryModel>   getTodayApprovalSummary(
        LocalDate date, String zone, String division, String branch);

HeadlineSummaryModel              getHeadlineSummary(
        LocalDate fromMonth, LocalDate toMonth, LocalDate date,
        String doCode, String branchCode);

ApproverBreakdownModel            getApproverBreakdown(
        String grain, LocalDate fromDate, LocalDate toDate, LocalDate date,
        String doCode, String branchCode);
```

All five rely on `MongoTemplate` injection via constructor
(`@RequiredArgsConstructor`). `getTodayApprovalSummary` is responsible
for:

* **Date fallback** — if `date == null`, substitute `LocalDate.now()`
  before building the `$match` so the aggregation always has a
  concrete day.
* **Hierarchy validation** (§3) — it rejects `division` without
  `zone` or `branch` without `zone`+`division` with
  `ResponseStatusException(HttpStatus.BAD_REQUEST, …)` before building
  the aggregation.

`getHeadlineSummary` is responsible for:

* **Independent normalization** per param (§2.5) — snap `fromMonth` /
  `toMonth` to first-of-month, default-fill whichever bound is null,
  default `date` to `LocalDate.now()`.
* **Range check** — reject `fromMonth > toMonth` with 400.
* Running **two separate aggregations** (one per collection) and
  merging the scalar results into one `HeadlineSummaryModel`
  instance. Zero-fill any null scalar in either pipeline's output so
  the response never contains a `null` count.

---

## 5. Data model

### 5.1 Collections and entities

| Purpose              | Collection                          | Entity                              | Time-bucket field |
| -------------------- | ----------------------------------- | ----------------------------------- | ----------------- |
| Daily active cases   | `active_cases_branchwise`           | `DailyBranchWiseReportEntity`       | `calDate`         |
| Weekly active cases  | `active_cases_weekly_branchwise`    | *(no entity — aggregates straight into `WeeklyDocumentSummaryModel`)*  | `calWeek`         |
| Monthly active cases | `active_cases_monthly_branchwise`   | *(no entity — aggregates straight into `MonthlyDocumentSummaryModel`)* | `calMonth`        |

Weekly and monthly use the overload `mongoTemplate.aggregate(agg,
collectionName, targetClass)` with the collection passed by name and
the result class being the typed summary model, so no `@Document`
entity is needed for those two collections.

### 5.2 Date-field storage convention

After the April 2026 migration, all three time-bucket fields are
stored as **BSON `Date` at UTC midnight** (`2024-05-01T00:00:00Z`),
not as ISO strings. The shared Spring bean
`com.palmyralabs.dms.config.MongoConfig` registers
`LocalDate ↔ Date` converters that force UTC at both ends, so the
Java entity fields are `LocalDate` and the Criteria/Query layer
serializes LocalDate values to the exact same UTC-midnight Dates.

Without the UTC converter, Spring's default Jsr310 converter uses the
JVM's system zone — on an IST JVM that silently produces
off-by-TZ-offset Dates that fail to match the stored values. Do not
remove `MongoConfig` or that contract breaks.

### 5.3 Source-of-truth shapes

All three collections share the same document schema; only the
time-bucket field name differs (`calDate` / `calWeek` / `calMonth`):

```
calDate | calWeek | calMonth (LocalDate)    pendingDocuments   (Integer)
doCode   branchCode                         submittedDocuments (Integer)
branchName divisionName  zone               processedDocuments (Integer)
perApprover: [ { approvedBy, accepted, rejected } ]
```

`DailyBranchWiseReportEntity` is the only typed Java entity — the
weekly and monthly collections are never materialized to a full entity
on the read path; the aggregation pipeline projects directly into the
typed summary models. `PerApprover` is a public static nested class
inside `DailyBranchWiseReportEntity`.

---

## 6. Aggregation pipelines

All three summary endpoints are implemented as **Mongo aggregation
pipelines** — no in-JVM summation. Groups happen server-side.

### 6.1 Daily / Weekly / Monthly pipeline (shared, via
`aggregateActiveCasesSummary(collection, timeField, …)`)

Single aggregation, no `$unwind` — the stored `pendingDocuments` /
`submittedDocuments` / `processedDocuments` are branch-day scalars
that can be summed directly, and the approved / rejected totals use
the nested `$sum` trick against `perApprover[]` without flattening
the array:

```
[
  { $match: { doCode?, branchCode?, <timeField>: { $gte?, $lte? } } },
  { $group: {
      _id: "$<timeField>",
      pendingDocuments:   { $sum: "$pendingDocuments" },
      submittedDocuments: { $sum: "$submittedDocuments" },
      processedDocuments: { $sum: "$processedDocuments" },
      approvedDocuments:  { $sum: { $sum: "$perApprover.accepted" } },
      rejectedDocuments:  { $sum: { $sum: "$perApprover.rejected" } }
  }},
  { $project: {
      _id: 0,
      <timeField>: "$_id",
      pendingDocuments: 1, submittedDocuments: 1, processedDocuments: 1,
      approvedDocuments: 1, rejectedDocuments: 1
  }},
  { $sort: { <timeField>: 1 } }
]
```

The nested `$sum` trick: inner `$sum: "$perApprover.accepted"`
returns the per-document sum of the approver array's `accepted`
values; the outer `$sum` accumulator adds those per-doc totals across
the group. In Spring Data Mongo DSL that's
`AccumulatorOperators.Sum.sumOf("perApprover.accepted")` inside
`GroupOperation.sum(AggregationExpression)`.

The per-approver breakdown has deliberately been **lifted out** of
this pipeline — on a wide range the unwind + regroup would multiply
the result size by the approver cardinality for no benefit, since the
main list view never renders the breakdown. Callers that need it fetch
one bucket at a time via §2.6.

### 6.2 Filter composition

`bucketMatch(timeField, doCode, branchCode, from, to)` builds the
`$match` criteria as an `$and` over whichever of these parts are
present (each optional):

* `{ doCode: { $eq: <value> } }`
* `{ branchCode: { $eq: <value> } }`
* `{ <timeField>: { $gte: <from>?, $lte: <to>? } }`

`doCode` / `branchCode` use `.is(...)` (exact match), not regex —
codes are unique IDs, no case/space variance to accommodate.

### 6.3 Today's approval pipeline (drill-down)

Source: `active_cases_branchwise`. Shared `$match` always clamps to
the single day `calDate = <date>` — the caller-supplied `date` param,
or `LocalDate.now()` when that param is null — and applies whichever
ancestor filters are present. The grouping stage differs per level;
the per-level shape is:

**Zone level (default, no drill-down filter):**

```
[
  { $match: { calDate: <date> } },
  { $group: {
      _id: "$Zone",
      approvedDocuments: { $sum: { $sum: "$perApprover.accepted" } },
      pendingDocuments:  { $sum: "$pendingDocuments" },
      rejectedDocuments: { $sum: { $sum: "$perApprover.rejected" } }
  }},
  { $project: {
      _id: 0, groupBy: "zone", zone: "$_id",
      approvedDocuments: 1, pendingDocuments: 1, rejectedDocuments: 1,
      processedDocuments: { $add: ["$approvedDocuments", "$rejectedDocuments"] }
  }},
  { $sort: { zone: 1 } }
]
```

**Division level (`zone` supplied):** same shape; `$match` adds
`Zone: <zone>`; `$group _id` is `$divisionName`; projected as
`{ groupBy: "division", zone: <zone>, division: "$_id", … }`.

**Branch level (`zone` + `division` supplied):** `$match` adds both;
`$group _id` is a compound `{ branchCode: "$branchCode",
branchName: "$branchName" }` so the name comes out alongside the code;
projected as `{ groupBy: "branch", zone, division,
branchCode: "$_id.branchCode", branchName: "$_id.branchName", … }`.

**SR level (`zone` + `division` + `branch` all supplied):** requires
an `$unwind` on `perApprover` before grouping:

```
[
  { $match: { calDate: <date>, zone: <zone>,
              divisionName: <division>, branchCode: <branch> } },
  { $unwind: { path: "$perApprover", preserveNullAndEmptyArrays: false } },
  { $group: {
      _id: "$perApprover.approvedBy",
      approvedDocuments: { $sum: "$perApprover.accepted" },
      rejectedDocuments: { $sum: "$perApprover.rejected" }
  }},
  { $project: {
      _id: 0, groupBy: "sr",
      zone: <zone-literal>, division: <division-literal>,
      branchCode: <branch-literal>,
      branchName: <resolved separately or projected from a preceding $lookup>,
      approvedBy: "$_id",
      approvedDocuments: 1,
      pendingDocuments: { $literal: 0 },
      rejectedDocuments: 1,
      processedDocuments: { $add: ["$approvedDocuments", "$rejectedDocuments"] }
  }},
  { $sort: { approvedBy: 1 } }
]
```

Notes:

* `preserveNullAndEmptyArrays: false` means docs with no approvers are
  omitted at SR level — which is correct: there's no SR row to emit.
  If a branch had only pending docs today, it shows **no rows at all**
  at SR level.
* `pendingDocuments` at SR level is hard-coded to `0` (see §2.4).
  Outer `$sum` of `"$perApprover.accepted"` is **not** nested here
  because `$unwind` already flattened the array — accepted/rejected
  are scalars at this point.
* `branchName` at SR level is either carried through the pipeline
  from the un-grouped document (using `$first` in the `$group`) or
  set as a literal from a preceding cheap `findOne` — either is fine,
  keep whichever matches the service style.
* Zone/division/branch literal values echoed into projection come
  from the request filter, not from the aggregated document, because
  after grouping on `approvedBy` those ancestor fields are gone.

### 6.4 Headline pipelines (six-month totals + one-day processed)

Two independent aggregations stitched together in Java, because the
sources are different collections. Both pipelines layer the same
optional scope criteria into their `$match` stage — whichever of
`doCode` / `branchCode` is non-blank adds an equality clause. Below,
`<scopeMatch>` is shorthand for that set of clauses (may be empty).

**Part A — six-month totals** (`active_cases_monthly_branchwise`).
Anchored to `fromMonth` / `toMonth` (both snapped to first-of-month
and defaulted independently per §2.5); the `date` request param does
**not** influence this pipeline:

```
[
  { $match: {
      calMonth: { $gte: <fromMonth>, $lte: <toMonth> },
      <scopeMatch>        // doCode? branchCode?
  }},
  { $group: {
      _id: null,
      pendingDocuments:   { $sum: "$pendingDocuments" },
      submittedDocuments: { $sum: "$submittedDocuments" },
      processedDocuments: { $sum: "$processedDocuments" },
      approvedDocuments:  { $sum: { $sum: "$perApprover.accepted" } },
      rejectedDocuments:  { $sum: { $sum: "$perApprover.rejected" } }
  }},
  { $project: {
      _id: 0,
      pendingDocuments: 1, submittedDocuments: 1, processedDocuments: 1,
      approvedDocuments: 1, rejectedDocuments: 1,
      totalDocuments: { $add: [
          "$pendingDocuments",
          "$submittedDocuments",
          "$processedDocuments"
      ]}
  }}
]
```

No `$unwind` — the nested `$sum` trick (`$sum: { $sum: "$perApprover.accepted" }`)
lets the outer accumulator add up per-doc approver totals across the
group.

**Part B — processed on a given day** (`active_cases_branchwise`).
Clamped to `calDate = <date>`, where `<date>` is the caller's param
or `LocalDate.now()` when absent. Same `<scopeMatch>` layered on top:

```
[
  { $match: {
      calDate: <date>,
      <scopeMatch>        // doCode? branchCode?
  }},
  { $group: {
      _id: null,
      totalProcessed: { $sum: "$processedDocuments" },
      approved:       { $sum: { $sum: "$perApprover.accepted" } },
      rejected:       { $sum: { $sum: "$perApprover.rejected" } }
  }},
  { $project: { _id: 0,
      totalProcessed: 1, approved: 1, rejected: 1 } }
]
```

Both pipelines return a single document (or zero if the respective
window is empty — the service substitutes `0L` for every missing
scalar before assembling the `HeadlineSummaryModel`).

By the per-doc invariant documented in
`specs/demo_data/data_model/active_cases_branchwise.txt`
(`SUM(perApprover.accepted + perApprover.rejected) == processedDocuments`),
Part B's `totalProcessed` should equal `approved + rejected` to the
integer. Treat a mismatch as a data-quality signal, not a bug in this
endpoint.

### 6.5 Approver breakdown pipelines (ranged)

Runs against the grain-specific collection (daily / weekly / monthly)
with `<timeField>` clamped to the snapped `[fromBucket, toBucket]`
range. Two small aggregations — the scalar-total query is no-unwind,
the approver query is the only place that unwinds.

**Part A — ranged processed total** (no `$unwind`):

```
[
  { $match: {
      <timeField>: { $gte: <fromBucket>, $lte: <toBucket> },
      doCode?, branchCode?
  }},
  { $group: {
      _id: null,
      processedDocuments: { $sum: "$processedDocuments" }
  }},
  { $project: { _id: 0, processedDocuments: 1 } }
]
```

Single-doc result; service substitutes `0L` when empty.

**Part B — per-approver breakdown over the range** (unwinds
`perApprover`, groups by `approvedBy`):

```
[
  { $match: {
      <timeField>: { $gte: <fromBucket>, $lte: <toBucket> },
      doCode?, branchCode?
  }},
  { $unwind: { path: "$perApprover", preserveNullAndEmptyArrays: false } },
  { $group: {
      _id: "$perApprover.approvedBy",
      approvedCount: { $sum: "$perApprover.accepted" },
      rejectedCount: { $sum: "$perApprover.rejected" }
  }},
  { $project: {
      _id: 0,
      approvedBy: "$_id",
      approvedCount: 1,
      rejectedCount: 1
  }},
  { $sort: { approvedBy: 1 } }
]
```

`preserveNullAndEmptyArrays: false` is fine here — branch-buckets
with no approver activity contribute nothing to the per-approver
breakdown and their `processedDocuments` of 0 already doesn't move
the Part A total.

**Invariant check**: by the per-doc invariant
(`SUM(perApprover.accepted + perApprover.rejected) == processedDocuments`),
`sum(perApprover[].approvedCount) + sum(perApprover[].rejectedCount)
== processedDocuments` over the whole range. A mismatch is a
data-quality signal, not a bug.

### 6.6 Bound normalization

| Window             | Normalization                                                      |
| ------------------ | ------------------------------------------------------------------ |
| Weekly             | `with(previousOrSame(SUNDAY))` on both from/to                     |
| Monthly            | `with(firstDayOfMonth())` on both from/to                          |
| Daily              | None (stored values are day-granular)                              |
| Headline           | `withDayOfMonth(1)` on `fromMonth`/`toMonth`; `date` unchanged     |
| Approver breakdown | Same rule applied to both `fromDate` and `toDate` — `daily`: as-is; `weekly`: `previousOrSame(SUNDAY)`; `monthly`: `withDayOfMonth(1)` |

Normalization is done in the service, before the interval-cap check
(when one applies) and before the Criteria is built.

---

## 7. Dependencies / side-effects

### 7.1 UTC-aware Mongo converter

`dms-main/src/main/java/com/palmyralabs/dms/config/MongoConfig.java`
registers `MongoCustomConversions` with:

* `LocalDate → Date`: `Date.from(src.atStartOfDay(ZoneOffset.UTC).toInstant())`
* `Date → LocalDate`: `src.toInstant().atZone(ZoneOffset.UTC).toLocalDate()`

This overrides Spring's built-in Jsr310 converters (which use the
system default zone). Loss of this bean breaks every date-field
Criteria match because the UTC-midnight stored Dates no longer equal
the system-zone midnight values Spring would otherwise produce.

### 7.2 Data loader alignment

`dms-revival` → `service/RevDataload/MongoDataLoader.java` ingests the
pipeline JSON. `FileSpec.dateFields` declares the ISO-date string
fields that must be upgraded to BSON Date on ingest:

| File                                    | Date fields    |
| --------------------------------------- | -------------- |
| `active_cases_branchwise.json`          | `cal_date`     |
| `active_cases_weekly_branchwise.json`   | `cal_week`     |
| `active_cases_monthly_branchwise.json`  | `cal_month`    |

`normalizeDateFields(doc, dateFields)` replaces each matching field
with `Date.from(LocalDate.parse(s).atStartOfDay(ZoneOffset.UTC).toInstant())`
before `buildWrite`. All three date fields are also upsert keys, so
the key filter uses Date equality — upserts against already-migrated
rows resolve cleanly instead of duplicating string-vs-Date pairs.

### 7.3 Database migration (already run)

One-shot via mongosh:

```js
[
  { coll: "active_cases_branchwise",         field: "cal_date"  },
  { coll: "active_cases_weekly_branchwise",  field: "cal_week"  },
  { coll: "active_cases_monthly_branchwise", field: "cal_month" }
].forEach(t =>
  db.getCollection(t.coll).updateMany(
    { [t.field]: { $type: "string" } },
    [ { $set: { [t.field]: { $toDate: "$" + t.field } } } ]
  )
);
```

Idempotent because of the `$type: "string"` guard.

---

## 8. Example requests

```
# Weekly for one DO/branch, last 8 weeks (mid-week input snaps to Sunday)
GET /api/palmyra/rev/overAll/document/summary
    ?window=weekly
    &doCode=247&branchCode=010A
    &fromWeek=2026-02-22&toWeek=2026-04-20

# Monthly, full series for one branch (no cap)
GET /api/palmyra/rev/overAll/document/summary
    ?window=monthly
    &branchCode=010A

# Monthly, mid-month inputs snap to the 1st
GET /api/palmyra/rev/overAll/document/summary
    ?window=monthly
    &fromMonth=2025-07-15&toMonth=2026-03-20
# -> treated as fromMonth=2025-07-01, toMonth=2026-03-01

# Daily, 2-month window exactly (allowed)
GET /api/palmyra/rev/overAll/document/summary
    ?window=daily
    &fromDate=2026-02-20&toDate=2026-04-20

# Rejected: daily interval > 2 months
GET /api/palmyra/rev/overAll/document/summary
    ?window=daily
    &fromDate=2026-01-01&toDate=2026-04-20
# -> 400 "daily interval exceeds 2 months (from=2026-01-01, to=2026-04-20)"

# Today's approval — default zone breakdown (date defaults to today)
GET /api/palmyra/rev/overAll/document/summary?window=todayApproval

# Same, but for a specific historical day
GET /api/palmyra/rev/overAll/document/summary
    ?window=todayApproval&date=2026-04-15

# Drill: divisions inside one zone, for a given day
GET /api/palmyra/rev/overAll/document/summary
    ?window=todayApproval&date=2026-04-15&zone=NORTH

# Drill: branches inside one division
GET /api/palmyra/rev/overAll/document/summary
    ?window=todayApproval&date=2026-04-15&zone=NORTH&division=DELHI

# Drill: SR / approver breakdown inside one branch
GET /api/palmyra/rev/overAll/document/summary
    ?window=todayApproval&date=2026-04-15
    &zone=NORTH&division=DELHI&branch=010A

# Rejected: branch filter without its ancestors
GET /api/palmyra/rev/overAll/document/summary
    ?window=todayApproval&branch=010A
# -> 400 "branch filter requires zone and division"

# Headline scorecard — all defaults (last 6 months + today, all branches)
GET /api/palmyra/rev/overAll/document/summary?window=headline
# -> { "totalDocuments": 1234, "pendingDocuments": 230,
#      "submittedDocuments": 450, "processedDocuments": 554,
#      "approvedDocuments": 480, "rejectedDocuments": 74,
#      "todayProcessed": {
#          "totalProcessed": 18, "approved": 15, "rejected": 3 } }

# Headline: only the processed-day shifts; 6-month block unchanged
GET /api/palmyra/rev/overAll/document/summary
    ?window=headline&date=2026-04-15

# Headline: custom monthly window, today default
GET /api/palmyra/rev/overAll/document/summary
    ?window=headline&fromMonth=2025-10-01&toMonth=2026-01-01

# Headline scoped to one branch (applies to both pipelines)
GET /api/palmyra/rev/overAll/document/summary
    ?window=headline&branchCode=359

# Headline scoped to one DO office, with a custom window and date
GET /api/palmyra/rev/overAll/document/summary
    ?window=headline
    &doCode=201
    &fromMonth=2025-11-01&toMonth=2026-04-01
    &date=2026-04-18

# Rejected: fromMonth after toMonth
GET /api/palmyra/rev/overAll/document/summary
    ?window=headline&fromMonth=2026-04-01&toMonth=2026-02-01
# -> 400 "fromMonth after toMonth"

# Approver breakdown — defaults to current daily bucket (fromDate/toDate both = LocalDate.now())
GET /api/palmyra/rev/overAll/document/summary?window=approverBreakdown
# -> { "grain": "daily", "fromBucket": "2026-04-21", "toBucket": "2026-04-21",
#      "processedDocuments": 45,
#      "perApprover": [
#        { "approvedBy": "57988792", "approvedCount": 24, "rejectedCount": 2 },
#        { "approvedBy": "61230015", "approvedCount": 18, "rejectedCount": 1 } ] }

# Approver breakdown — quarter-wide monthly range (Feb–Apr 2026)
GET /api/palmyra/rev/overAll/document/summary
    ?window=approverBreakdown&grain=monthly
    &fromDate=2026-02-01&toDate=2026-04-01

# Approver breakdown — single day (daily grain, fromDate == toDate)
GET /api/palmyra/rev/overAll/document/summary
    ?window=approverBreakdown&grain=daily
    &fromDate=2026-04-17&toDate=2026-04-17

# Approver breakdown — single day via the `date` shortcut (equivalent to the above)
GET /api/palmyra/rev/overAll/document/summary
    ?window=approverBreakdown&grain=daily&date=2026-04-17

# Approver breakdown — one specific month via `date` (snapped to Apr 1 2026 by monthly grain)
GET /api/palmyra/rev/overAll/document/summary
    ?window=approverBreakdown&grain=monthly&date=2026-04-15

# Approver breakdown — last 8 weeks (weekly grain), scoped to one branch
GET /api/palmyra/rev/overAll/document/summary
    ?window=approverBreakdown&grain=weekly
    &fromDate=2026-02-22&toDate=2026-04-19
    &branchCode=359

# Approver breakdown — monthly range for one DO office
GET /api/palmyra/rev/overAll/document/summary
    ?window=approverBreakdown&grain=monthly
    &fromDate=2026-01-01&toDate=2026-03-01
    &doCode=201

# Rejected: bad grain
GET /api/palmyra/rev/overAll/document/summary
    ?window=approverBreakdown&grain=hourly
# -> 400 "grain must be one of: daily, weekly, monthly"

# Rejected: fromDate after toDate (after snap)
GET /api/palmyra/rev/overAll/document/summary
    ?window=approverBreakdown&grain=monthly
    &fromDate=2026-04-01&toDate=2026-02-01
# -> 400 "fromDate after toDate"
```

---

## 9. Known caveats / open items

1. **Open-ended intervals skip the cap** — `fromDate=2020-01-01` with
   no `toDate` fetches everything from that date forward. If stricter
   behavior is needed, require both bounds or default the missing side
   to `LocalDate.now()` before `assertMaxInterval`. (Moot for monthly,
   which has no cap by design.)
2. **System-zone `LocalDate.now()` fallback in
   `getTodayApprovalSummary`** — when the `date` param is omitted, the
   service substitutes the JVM's local "today." Combined with the UTC
   converter, this matches stored `calDate` only when the server's
   local date equals the UTC date — i.e. outside the five-and-a-half-
   hour window each day where IST is already on the next date relative
   to UTC. Prefer passing `date` explicitly from the frontend.
3. `pendingDocuments` in the weekly/monthly/daily summaries is summed
   across daily/weekly/monthly snapshots. Each day's `pendingDocuments`
   counts docs still pending at end-of-day, so an item pending for 14
   days contributes 14 to the summed `pendingDocuments`. This is a
   "pending-days" metric, not a distinct-pending count.
