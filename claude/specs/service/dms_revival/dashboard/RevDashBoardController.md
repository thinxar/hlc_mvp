# RevDashBoardController — Specification

Dashboard summary endpoints for the **Revival** feature. Single path,
discriminated by a `window` query param into four aggregations
(monthly document counts, weekly active-cases, daily active-cases,
and today's approval roll-up with hierarchical drill-down).

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
(`palmyra`), all four endpoints live under
`/api/palmyra/rev/overAll/document/summary`. The frontend constant
`ServiceEndpoint.customView.rev.cart.summaryView` holds `/rev/overAll/document/summary`.

Four `@GetMapping` methods share the same path and are selected by
Spring's `params` discriminator:

| Method                             | Discriminator                     | Default match? |
| ---------------------------------- | --------------------------------- | -------------- |
| `getMonthlyDocumentSummary`        | *(no `params` constraint)*        | Yes — matches if `window` absent or any value other than the explicit ones below |
| `getWeeklyDocumentSummary`         | `params = "window=weekly"`        | No             |
| `getDailyDocumentSummary`          | `params = "window=daily"`         | No             |
| `getTodayApprovalSummary`          | `params = "window=todayApproval"` | No             |

Because the monthly method has no `params` filter, Spring's
more-specific rule routes `window=weekly` / `window=daily` /
`window=todayApproval` to the appropriate specific handler and
anything else — including no `window` at all — to
`getMonthlyDocumentSummary`.

---

## 2. Endpoints

All four return `PalmyraResponse<List<…>>`; only the payload element
type and query params differ.

### 2.1 Monthly document summary

`GET /rev/overAll/document/summary`
`GET /rev/overAll/document/summary?window=monthly`  *(catch-all)*

| Param        | Type              | Required | Notes                                                   |
| ------------ | ----------------- | -------- | ------------------------------------------------------- |
| `doCode`     | string            | no       | exact match on stored `doCode`                          |
| `branchCode` | string            | no       | exact match on stored `branchCode`                      |
| `fromMonth`  | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; day normalized to 1st of month            |
| `toMonth`    | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; day normalized to 1st of month, inclusive |

**Response element** — `MonthlyDocumentSummaryModel`:

```json
{
  "month":              "2024-05-01",
  "approvedDocuments":  18,
  "pendingDocuments":   0,
  "rejectedDocuments":  0,
  "processedDocuments": 18
}
```

* `month` is a `LocalDate` (Jackson JSR-310 formats as `yyyy-MM-dd`).
* Sums are across every branch-month row matching the filters.
* `processedDocuments = approvedDocuments + rejectedDocuments` —
  derived server-side inside the aggregation `$project`.
* List is sorted ascending by `month`.

### 2.2 Weekly active-cases summary

`GET /rev/overAll/document/summary?window=weekly`

| Param        | Type              | Required | Notes                                                                          |
| ------------ | ----------------- | -------- | ------------------------------------------------------------------------------ |
| `doCode`     | string            | no       | exact match                                                                    |
| `branchCode` | string            | no       | exact match                                                                    |
| `fromWeek`   | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; snapped to the previous-or-same **Sunday**                       |
| `toWeek`     | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; snapped to the previous-or-same **Sunday** (inclusive)           |

Response element — `WeeklyDocumentSummaryModel` with `cal_week` in
place of `month`; other fields identical to monthly.

### 2.3 Daily active-cases summary

`GET /rev/overAll/document/summary?window=daily`

| Param        | Type              | Required | Notes                                           |
| ------------ | ----------------- | -------- | ----------------------------------------------- |
| `doCode`     | string            | no       | exact match                                     |
| `branchCode` | string            | no       | exact match                                     |
| `fromDate`   | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; no normalization (day-granular)   |
| `toDate`     | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; inclusive                         |

Response element — `DailyDocumentSummaryModel` with `cal_date` in
place of `month`.

### 2.4 Today's approval summary (hierarchical drill-down)

`GET /rev/overAll/document/summary?window=todayApproval`

Aggregates `active_cases_branchwise` for a **single calendar day** —
the day is supplied via the `date` param. If `date` is omitted the
service falls back to `LocalDate.now()` (server's local date — same
caveat as §9.4) so the out-of-the-box call still behaves as "today's
approval." The grouping dimension is driven by the filter params: the
response groups one level *below* the deepest filter supplied. Zero
filters → zone breakdown; full filter triple → per-SR breakdown inside
that branch.

| Param      | Type              | Required | Notes                                                                                 |
| ---------- | ----------------- | -------- | ------------------------------------------------------------------------------------- |
| `date`     | `LocalDate` (ISO) | no       | `yyyy-MM-dd`; exact match on `cal_date`; defaults to `LocalDate.now()` when omitted   |
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

---

## 3. Validation — error responses (400 Bad Request)

| Condition                                                                                   | Example                                                                              |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Unparseable date in any `from*` / `to*` / `date` param                                      | `fromMonth=bogus` or `date=xyz` → Spring `MethodArgumentTypeMismatchException` → 400 |
| Non-ISO date format                                                                         | `fromMonth=2024-5-1` or `date=2026-4-15` → 400 (ISO requires zero-padding)           |
| Weekly interval > **6 months** (after Sunday normalization)                                 | `fromWeek=2025-10-01&toWeek=2026-05-01` → `weekly interval exceeds 6 months (…)`     |
| Daily interval > **2 months**                                                               | `fromDate=2026-01-01&toDate=2026-04-20` → `daily interval exceeds 2 months (…)`      |
| `todayApproval`: `division` supplied without `zone`                                         | `window=todayApproval&division=X` → `division filter requires zone`                  |
| `todayApproval`: `branch` supplied without `zone` + `division`                              | `window=todayApproval&branch=010A` → `branch filter requires zone and division`      |

Interval cap semantics: `to.isAfter(from.plusMonths(N))` rejects.
A range exactly N months wide is allowed.

Cap is skipped if either bound is null — a one-sided or unbounded
query is permitted to fetch the full collection. Tighten via service
if that becomes an issue.

Monthly has **no** interval cap.

---

## 4. Service contract (summary)

```java
List<MonthlyDocumentSummaryModel> getMonthlyDocumentSummary(
        String doCode, String branchCode, LocalDate fromMonth, LocalDate toMonth);

List<WeeklyDocumentSummaryModel>  getWeeklyDocumentSummary(
        String doCode, String branchCode, LocalDate fromWeek, LocalDate toWeek);

List<DailyDocumentSummaryModel>   getDailyDocumentSummary(
        String doCode, String branchCode, LocalDate fromDate, LocalDate toDate);

List<ResponseModel>               getMonthlyActiveCasesSummary(
        String doCode, String branchCode);   // NOT currently exposed as an endpoint

List<TodayApprovalSummaryModel>   getTodayApprovalSummary(
        LocalDate date, String zone, String division, String branch);
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

---

## 5. Data model

### 5.1 Collections and entities

| Purpose              | Collection                          | Entity                              | Time-bucket field |
| -------------------- | ----------------------------------- | ----------------------------------- | ----------------- |
| Monthly documents    | `monthly_branchwise_report`         | `MonthWiseReportEntity`             | `month`           |
| Daily active cases   | `active_cases_branchwise`           | `DailyBranchWiseReportEntity`       | `cal_date`        |
| Weekly active cases  | `active_cases_weekly_branchwise`    | *(reuses `DailyBranchWiseReport…`)* | `cal_week`        |
| Monthly active cases | `active_cases_monthly_branchwise`   | `MonthlyActiveCasesEntity`          | `cal_month`       |

Weekly uses the overload `mongoTemplate.aggregate(agg, collectionName,
targetClass)` so the entity's default `@Document(collection=…)` is
bypassed.

### 5.2 Date-field storage convention

After the April 2026 migration, all four time-bucket fields are
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

`MonthWiseReportEntity`:

```
month (LocalDate, key)    no_cases
zone                      totalDocuments (Long)
divisionName              approvedDocuments (Long)
doCode  branchCode        pendingDocuments (Long)
branchName                rejectedDocuments (Long)
```

`DailyBranchWiseReportEntity` / `MonthlyActiveCasesEntity` (same
schema, different time-bucket field):

```
cal_date | cal_month (LocalDate)   pendingDocuments  (Integer)
doCode   branchCode                submittedDocuments (Integer)
branchName divisionName  Zone      processedDocuments (Integer)
perApprover: [ { approvedBy, accepted, rejected } ]
```

`PerApprover` is a public static nested class inside
`DailyBranchWiseReportEntity`; `MonthlyActiveCasesEntity` reuses it.

---

## 6. Aggregation pipelines

All four summary endpoints are implemented as **Mongo aggregation
pipelines** — no in-JVM summation. Groups happen server-side.

### 6.1 Monthly pipeline

```
[
  { $match: { doCode?, branchCode?, month: { $gte?, $lte? } } },
  { $group: {
      _id: "$month",
      approvedDocuments: { $sum: "$approvedDocuments" },
      pendingDocuments:  { $sum: "$pendingDocuments"  },
      rejectedDocuments: { $sum: "$rejectedDocuments" }
  }},
  { $project: {
      _id: 0,
      month: "$_id",
      approvedDocuments: 1, pendingDocuments: 1, rejectedDocuments: 1,
      processedDocuments: { $add: ["$approvedDocuments",
                                  "$rejectedDocuments"] }
  }},
  { $sort: { month: 1 } }
]
```

Source fields (`approvedDocuments`, etc.) come pre-summed per
branch-month in the source collection, so the outer `$sum` just rolls
them up across branches.

### 6.2 Daily / Weekly pipeline (shared, via
`aggregateActiveCasesSummary(collection, timeField, …)`)

```
[
  { $match: { doCode?, branchCode?, <timeField>: { $gte?, $lte? } } },
  { $group: {
      _id: "$<timeField>",
      approvedDocuments: { $sum: { $sum: "$perApprover.accepted" } },
      pendingDocuments:  { $sum: "$pendingDocuments" },
      rejectedDocuments: { $sum: { $sum: "$perApprover.rejected" } }
  }},
  { $project: {
      _id: 0,
      <timeField>: "$_id",
      approvedDocuments: 1, pendingDocuments: 1, rejectedDocuments: 1,
      processedDocuments: { $add: ["$approvedDocuments",
                                  "$rejectedDocuments"] }
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

### 6.3 Filter composition

`bucketMatch(timeField, doCode, branchCode, from, to)` builds the
`$match` criteria as an `$and` over whichever of these parts are
present (each optional):

* `{ doCode: { $eq: <value> } }`
* `{ branchCode: { $eq: <value> } }`
* `{ <timeField>: { $gte: <from>?, $lte: <to>? } }`

`doCode` / `branchCode` use `.is(...)` (exact match), not regex —
codes are unique IDs, no case/space variance to accommodate.

### 6.4 Today's approval pipeline (drill-down)

Source: `active_cases_branchwise`. Shared `$match` always clamps to
the single day `cal_date = <date>` — the caller-supplied `date` param,
or `LocalDate.now()` when that param is null — and applies whichever
ancestor filters are present. The grouping stage differs per level;
the per-level shape is:

**Zone level (default, no drill-down filter):**

```
[
  { $match: { cal_date: <date> } },
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
  { $match: { cal_date: <date>, Zone: <zone>,
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

### 6.5 Bound normalization

| Window  | Normalization                                     |
| ------- | ------------------------------------------------- |
| Monthly | `withDayOfMonth(1)` on both from/to               |
| Weekly  | `with(previousOrSame(SUNDAY))` on both from/to    |
| Daily   | None (stored values are day-granular)             |

Normalization is done in the service, before the interval-cap check
and before the Criteria is built.

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
| `monthly_branchwise_report.json`        | `month`        |
| `active_cases_branchwise.json`          | `cal_date`     |
| `active_cases_weekly_branchwise.json`   | `cal_week`     |
| `active_cases_monthly_branchwise.json`  | `cal_month`    |

`normalizeDateFields(doc, dateFields)` replaces each matching field
with `Date.from(LocalDate.parse(s).atStartOfDay(ZoneOffset.UTC).toInstant())`
before `buildWrite`. Because two of those fields are also upsert keys
(`cal_date`, `cal_week`, `cal_month`), the key filter then uses Date
equality — upserts against already-migrated rows resolve cleanly
instead of duplicating string-vs-Date pairs.

### 7.3 Database migration (already run)

One-shot via mongosh:

```js
[
  { coll: "active_cases_branchwise",         field: "cal_date"  },
  { coll: "active_cases_weekly_branchwise",  field: "cal_week"  },
  { coll: "active_cases_monthly_branchwise", field: "cal_month" },
  { coll: "monthly_branchwise_report",       field: "month"     }
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
# Last 6 months, all branches (catch-all / monthly)
GET /api/palmyra/rev/overAll/document/summary
    ?fromMonth=2025-11-01&toMonth=2026-04-01

# Weekly for one DO/branch, last 8 weeks (mid-week input snaps to Sunday)
GET /api/palmyra/rev/overAll/document/summary
    ?window=weekly
    &doCode=247&branchCode=010A
    &fromWeek=2026-02-22&toWeek=2026-04-20

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
```

---

## 9. Known caveats / open items

1. **`getMonthlyActiveCasesSummary`** — exists in the service but is
   not exposed by any controller mapping. Still uses the legacy
   `ResponseModel` shape with `total / approved / pending / rejected /
   todayDocuments`, plus the `computeTodayDocuments` drill-down. Bring
   in line with the aggregation + typed-model pattern when/if it needs
   an endpoint.
2. **Open-ended intervals skip the cap** — `fromDate=2020-01-01` with
   no `toDate` fetches everything from that date forward. If stricter
   behavior is needed, require both bounds or default the missing side
   to `LocalDate.now()` before `assertMaxInterval`.
3. **`RevDashBoardModelMapper` and `MonthWiseReportModel`** are no
   longer referenced by the service — kept on disk for now, safe to
   delete.
4. **System-zone `LocalDate.now()`** in `computeTodayDocuments`: reads
   the JVM's local "today." Combined with the UTC converter, this
   matches stored `cal_date` only when the server's local date equals
   the UTC date — i.e. outside the five-and-a-half-hour window each
   day where IST is already on the next date relative to UTC. Revisit
   if the `getMonthlyActiveCasesSummary` method gets promoted to a
   real endpoint.
5. `pendingDocuments` in the weekly/daily summaries is summed across
   daily/weekly snapshots. Each day's `pendingDocuments` counts docs
   still pending at end-of-day, so an item pending for 14 days
   contributes 14 to the summed `pendingDocuments`. This is a
   "pending-days" metric, not a distinct-pending count. Monthly
   doesn't have this wart because source rows are already
   month-aggregated.
