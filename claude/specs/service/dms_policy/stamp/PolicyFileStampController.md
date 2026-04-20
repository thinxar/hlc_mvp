# PolicyFileStampController — Specification

Adds a batch of "fixed stamps" to a single policy file. A stamp is a
master-data marker (from `mst_fixed_stamp`) placed at a given `(page,
x, y, scaleX, scaleY)` position on the PDF/image. Each entry is
validated individually (duplicate-stamp rejection, stamp-code lookup,
policy-file match) before any persistence happens.

**Module**: `service/dms-policy` (legacy JPA variant)
**Controller**: `com.palmyralabs.dms.controller.PolicyFileStampController`
**Service**:    `com.palmyralabs.dms.service.PolicyFileStampService`

Base class: palmyralabs `AbstractController`
(`com.palmyralabs.palmyra.core.rest.controller.AbstractController`) —
provides the `apiResponse(...)` wrapper that builds a
`PalmyraResponse<T>`. The project-local `BaseController` is NOT used
here.

---

## 1. Routing

Class-level mapping:

```java
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")
```

Combined with the Jetty servlet context `/api` (from
`service/dms-main/src/main/resources/application.yaml` →
`server.servlet.context-path: /api`) and the default prefix `palmyra`,
the class root is `/api/palmyra/policy`.

| Method                 | Path (relative)          | HTTP  | Full external URL                                          |
| ---------------------- | ------------------------ | ----- | ---------------------------------------------------------- |
| `addStampToPolicyFile` | `/policyFile/fixedStamp` | POST  | `POST /api/palmyra/policy/policyFile/fixedStamp`           |

Security — authenticated session required (inherited default from
`service/dms-base/src/main/java/com/palmyralabs/dms/base/config/SecurityConfig.java`).
No method-level role check.

---

## 2. Endpoints

### 2.1 Bulk-add stamps to one policy file

```
POST /api/palmyra/policy/policyFile/fixedStamp
Content-Type: application/json
```

**Request body** — `com.palmyralabs.dms.model.PolicyStampRequest`:

```java
class PolicyStampRequest {
    Long policyFileId;
    List<PolicyStampPositionModel> stamp;
}

class PolicyStampPositionModel {
    String code;      // FixedStamp.code
    Long   pageNumber;
    String left;
    String scaleX;
    String scaleY;
    String top;
}
```

Example:

```json
{
  "policyFileId": 273,
  "stamp": [
    {
      "code":"APPROVED",
      "pageNumber": 1,
      "left":   "120.5",
      "top":    "450.0",
      "scaleX": "1.0",
      "scaleY": "1.0"
    },
    {
      "code":"SIGNED",
      "pageNumber": 3,
      "left":   "85.0",
      "top":    "700.0",
      "scaleX": "1.0",
      "scaleY": "1.0"
    }
  ]
}
```

**Flow** (`PolicyFileStampService.addStamp`):

1. `policyFileRepository.findById(policyFileId)` — 404 (via
   `DataNotFoundException("INV012", "policy record not found")`) if
   absent.

   Note: the message says "policy record not found" but the lookup is
   on `dms_policy_file`, not `dms_policy`. Cosmetic — §8.
2. `validateStampInfo(policyFileEntity, request)`:
   * Sanity check: `policyFileEntity.id == request.policyFileId`
     (redundant with step 1). Mismatch →
     `InvaidInputException("INV001", "file record mismatch")` → 400.
   * If `request.stamp.size() == 0` (note: uses `.size() == 0`, not
     `.isEmpty()`; NPE if null, §8) →
     `InvaidInputException("INV001", "stamp is empty")` → 400.
   * For each `PolicyStampPositionModel`:
     a. `fixedStampRepo.findByCode(stamp.code)` → if empty,
        `InvaidInputException("INV001", "stamp not found")` → 400.
     b. `pFixedStampRepo.findByPolicyFileAndStamp(policyFileId,
        stampEntity.id)` → if present,
        `InvaidInputException("INV001", "stamp already exists")` → 400.

        The uniqueness constraint is also enforced at DB level via
        `uq_dms_policy_file_stamp UNIQUE (policy_file, stamp)` (see
        `dbscripts/006.dms.sql` / `alter_11_05.sql`). The service-level
        check exists to return a nicer error before the save.
     c. Build a new `PolicyFileFixedStampEntity` with:
        * `policyFile = request.policyFileId`
        * `stamp = stampEntity.id`
        * `position = JSON.stringify(positionModel)` — stored as TEXT,
          serialized from the request entry via
          `ObjectMapper.writerFor(PolicyStampPositionModel.class)`.
3. `pFixedStampRepo.saveAll(entities)` — one `JpaRepository.saveAll`;
   audit fields (`created_by`, `created_on`, …) populated via the JPA
   `@EntityListeners(AuditListener.class)` on the entity (see
   `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/PolicyFileFixedStampEntity.java`).
4. `getPolicyStampModels(savedEntities)` — for each saved row:
   * Read `Timestamps.createdOn` and `toString()` it (ISO-like
     `LocalDateTime.toString()` — e.g. `"2025-11-05T14:22:01.123"`).
   * Parse the `position` TEXT back into a `PolicyStampPositionModel`;
     on Jackson failure set `position = null` (swallowed error). §8.
   * Re-read the referenced `FixedStampEntity` by id (an extra SELECT
     per result row) to build a `FixedStampModel`.
   * Emit a `PolicyStampModel`.

**Response** — `PalmyraResponse<List<PolicyStampModel>>` via
`AbstractController.apiResponse(...)`. Envelope shape (palmyralabs
standard):

```json
{
  "status":  "success",
  "result": [
    {
      "stamp": {
        "id": 2, "name":"Approved Stamp", "code":"APPROVED", "description":null
      },
      "createdOn": "2025-11-05T14:22:01.123",
      "position": {
        "code":"APPROVED", "pageNumber":1,
        "left":"120.5", "top":"450.0", "scaleX":"1.0", "scaleY":"1.0"
      }
    },
    {
      "stamp": { "id": 4, "name":"Signed",   "code":"SIGNED",   "description":null },
      "createdOn": "2025-11-05T14:22:01.123",
      "position": {
        "code":"SIGNED", "pageNumber":3,
        "left":"85.0", "top":"700.0", "scaleX":"1.0", "scaleY":"1.0"
      }
    }
  ]
}
```

(The exact envelope depends on the palmyralabs `PalmyraResponse`
contract — typical fields `status`, `result`, `errors`. The payload in
`result` is the `List<PolicyStampModel>` shown.)

**Transactional behaviour**: no explicit `@Transactional` on service
or repo. `JpaRepository.saveAll` uses the default Spring TX; if the
`saveAll` fails mid-batch, persisted entities rely on the
auto-rollback of the ambient TX. Note that validation happens
sequentially in `validateStampInfo` BEFORE `saveAll`, so any
validation error throws before any write.

---

## 3. Validation / error responses

Codes emitted by this controller, mapped via
`service/dms-base/src/main/java/com/palmyralabs/dms/base/handler/GlobalExceptionHandler.java`:

| Condition                                   | Exception                                                | HTTP |
| ------------------------------------------- | -------------------------------------------------------- | ---- |
| `policyFileId` not in `dms_policy_file`     | `DataNotFoundException("INV012", "policy record not found")` | 404  |
| `stamp` list empty                          | `InvaidInputException("INV001", "stamp is empty")`        | 400  |
| `code` not in `mst_fixed_stamp`             | `InvaidInputException("INV001", "stamp not found")`       | 400  |
| Same `(policyFile, stamp)` already saved    | `InvaidInputException("INV001", "stamp already exists")`  | 400  |
| Internal sanity mismatch (should not occur) | `InvaidInputException("INV001", "file record mismatch")`  | 400  |
| Jackson fails to serialize a position       | silently logged, position left as `""` in DB              | —    |
| Jackson fails to deserialize a position     | silently logged, `position = null` in response           | —    |
| Unique-constraint violation at DB           | `DataIntegrityViolationException` — unhandled, default 500 | 500  |
| Unauthenticated request                     | Spring Security filter                                    | 401  |

Global mapping reference: see
`claude/specs/service/dms_base/base/BaseController.md` §3.1.

---

## 4. Service contract

```java
// PolicyFileStampService
List<PolicyStampModel> addStamp(PolicyStampRequest request);
```

Injected collaborators (`@RequiredArgsConstructor`):

```java
PolicyFileRepository        policyFileRepository;
PolicyFileFixedStampRepo    pFixedStampRepo;
FixedStampRepo              fixedStampRepo;
ObjectMapper                mapper;   // from Spring's Jackson autoconfig
```

Private helpers:

```java
List<PolicyFileFixedStampEntity> validateStampInfo(PolicyFileEntity, PolicyStampRequest);
String                           getPosition(PolicyStampPositionModel);  // JSON.stringify
List<PolicyStampModel>           getPolicyStampModels(List<PolicyFileFixedStampEntity>);
FixedStampModel                  toStampModel(FixedStampEntity);
Optional<PolicyFileFixedStampEntity> getPolicyAndStampEntity(Long policyFile, Long stamp);
Optional<FixedStampEntity>       getStampEntity(String code);
FixedStampEntity                 getStampEntity(Long id);                 // throws INV001 if missing
```

---

## 5. Data model

### 5.1 Entities

| Entity                                                                                                               | Table                           | Role                                      |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------- |
| `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/PolicyFileEntity.java`                                 | `dms_policy_file`               | Identity check for `policyFileId`.        |
| `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/FixedStampEntity.java`                                 | `mst_fixed_stamp`               | Code → id resolution.                     |
| `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/PolicyFileFixedStampEntity.java`                       | `dms_policy_file_fixed_stamp`   | Persisted stamp placement (one per stamp).|

### 5.2 Key schema (`dbscripts/006.dms.sql` + `alter_11_03.sql` + `alter_11_05.sql`)

```sql
CREATE TABLE mst_fixed_stamp (
    id int8 NOT NULL,
    "name"       varchar(128) NOT NULL,
    code         varchar(128) NOT NULL,
    description  varchar(250) NULL,
    created_by, last_upd_by, created_on, last_upd_on
);

CREATE TABLE dms_policy_file_fixed_stamp (
    id           bigserial NOT NULL,
    policy_file  int8 NOT NULL,
    stamp        int8 NOT NULL,
    created_by, last_upd_by, created_on, last_upd_on,
    "position"   text NULL,
    CONSTRAINT dms_policy_file_fixed_stamp_p_key PRIMARY KEY (id),
    CONSTRAINT uq_dms_policy_file_stamp UNIQUE (policy_file, stamp),
    CONSTRAINT fk_dms_policy_file                  FOREIGN KEY (policy_file) REFERENCES dms.dms_policy_file(id),
    CONSTRAINT fk_dms_policy_file_fixed_stamp_stamp FOREIGN KEY (stamp)      REFERENCES dms.mst_fixed_stamp(id)
);
```

* `position` is TEXT, holding the JSON-serialized
  `PolicyStampPositionModel`.
* `(policy_file, stamp)` is unique — one placement per stamp-type per
  file. The service rejects duplicates with a nicer 400; the DB is
  the backstop.

### 5.3 Repositories

```java
// PolicyFileRepository  (service/dms-jpa/.../repository/PolicyFileRepository.java)
Optional<PolicyFileEntity> findById(Long id);

// PolicyFileFixedStampRepo
Optional<PolicyFileFixedStampEntity> findByPolicyFileAndStamp(Long fileId, Long stampId);

// FixedStampRepo
Optional<FixedStampEntity> findById(Long id);
Optional<FixedStampEntity> findByCode(String code);
```

`PolicyFileFixedStampRepo extends JpaRepository<…, Integer>` though
the entity's primary key is `Long` — minor inconsistency like
`PolicyRepository`.

### 5.4 DTOs

| DTO                                                                                                           | Purpose                                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `service/dms-policy/src/main/java/com/palmyralabs/dms/model/PolicyStampRequest.java`                          | Request body.                          |
| `service/dms-policy/src/main/java/com/palmyralabs/dms/model/PolicyStampPositionModel.java`                    | Per-stamp placement; echoed back.      |
| `service/dms-policy/src/main/java/com/palmyralabs/dms/model/PolicyStampModel.java`                            | Per-entry in the response list.        |
| `service/dms-masterdata/src/main/java/com/palmyralabs/dms/masterdata/model/FixedStampModel.java`              | Embedded `stamp` in the response.      |
| `service/dms-policy/src/main/java/com/palmyralabs/dms/model/PolicyFileFixedStampModel.java`                   | Read-side palmyralabs DSL model (used by `DmsPolicyFileHandler`, not by this service). |

All request-side fields are `String` (including numeric coords). That
is intentional — preserves any client-side precision string
unchanged through the round trip and means the server never has to
reconcile float/double vs BigDecimal.

### 5.5 Shape translation summary

```
Request:       PolicyStampRequest
               ├─ policyFileId → PolicyFileFixedStampEntity.policyFile
               └─ stamp[]
                     ├─ code   → look up FixedStampEntity.id → .stamp
                     └─ (all)  → JSON-string → .position (TEXT)

Response:      PolicyStampModel
               ├─ stamp     ← FixedStampEntity (re-read)
               ├─ createdOn ← Timestamps.createdOn.toString()
               └─ position  ← mapper.readValue(entity.position, …)
```

---

## 6. Dependencies / side-effects

### 6.1 DB

* Reads: `dms_policy_file` (1), `mst_fixed_stamp` (1 per stamp code),
  `dms_policy_file_fixed_stamp` (1 per stamp — uniqueness pre-check).
* Writes: `dms_policy_file_fixed_stamp` (1 insert per stamp in the
  batch). Audit columns populated automatically by
  `@EntityListeners(AuditListener.class)`.
* Response path re-reads `mst_fixed_stamp` per saved entity (1 extra
  SELECT per stamp). N+1 pattern — benign for the single-digit batch
  sizes seen in practice.

### 6.2 S3 / filesystem / async
None.

### 6.3 Security
Requires auth; no role gate. Any authenticated user can place stamps
on any `policyFile` they know the id of.

---

## 7. Example requests

```bash
# Happy path: two stamps
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{
           "policyFileId": 273,
           "stamp": [
             { "code":"APPROVED", "pageNumber":1, "left":"120.5", "top":"450.0", "scaleX":"1.0", "scaleY":"1.0" },
             { "code":"SIGNED",   "pageNumber":3, "left":"85.0",  "top":"700.0", "scaleX":"1.0", "scaleY":"1.0" }
           ]
         }' \
     http://localhost:7070/api/palmyra/policy/policyFile/fixedStamp
# -> 200 { "status":"success", "result":[ ... ] }

# Policy file not found
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{ "policyFileId": 999999, "stamp":[{ "code":"APPROVED", "pageNumber":1, "left":"0", "top":"0", "scaleX":"1", "scaleY":"1" }] }' \
     http://localhost:7070/api/palmyra/policy/policyFile/fixedStamp
# -> 404 { "errorCode":"INV012", "errorMessage":"policy record not found" }

# Unknown stamp code
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{ "policyFileId": 273, "stamp":[{ "code":"BOGUS", "pageNumber":1, "left":"0", "top":"0", "scaleX":"1", "scaleY":"1" }] }' \
     http://localhost:7070/api/palmyra/policy/policyFile/fixedStamp
# -> 400 { "errorCode":"INV001", "errorMessage":"stamp not found" }

# Duplicate stamp on same file
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{ "policyFileId": 273, "stamp":[{ "code":"APPROVED", "pageNumber":1, "left":"0", "top":"0", "scaleX":"1", "scaleY":"1" }] }' \
     http://localhost:7070/api/palmyra/policy/policyFile/fixedStamp
# -> 400 { "errorCode":"INV001", "errorMessage":"stamp already exists" }

# Empty batch
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{ "policyFileId": 273, "stamp": [] }' \
     http://localhost:7070/api/palmyra/policy/policyFile/fixedStamp
# -> 400 { "errorCode":"INV001", "errorMessage":"stamp is empty" }
```

---

## 8. Known caveats / open items

1. **Error message "policy record not found"** when the lookup is on
   `dms_policy_file`. Rename to "policy file not found" so error
   messages match the table.
2. **All errors use `INV001`** regardless of specific cause ("file
   record mismatch", "stamp is empty", "stamp not found", "stamp
   already exists"). Clients can only differentiate by message
   string. Split into `INV002`/`INV003`/… for machine-readable
   discrimination.
3. **`stamp.size() == 0` instead of `stamp.isEmpty()`** — plus no null
   check on `request.getStamp()`. A `{}` body reaches
   `validateStampInfo` with a null list and throws a bare NPE → 500.
   Replace with `CollectionUtils.isEmpty(stamp)` and a typed 400.
4. **Jackson errors are swallowed.** `getPosition` catches everything
   and just logs `log.error("... {}", ..., e.getMessage())` — note
   the format string takes `{}` but the args are `(model, e.getMessage())`,
   so the exception is rendered as the model argument and the
   `%s`/`{}` for the message consumes nothing. The stored `position`
   is then `""` (empty) and the row is persisted anyway. Either bubble
   the exception or stop the save.
5. **Response `position` is `null` on Jackson round-trip failure**,
   not surfaced to the caller. If the stored JSON is corrupt (say,
   older rows), the response silently drops position info. Log at
   WARN and include a flag in the response.
6. **N+1 SELECT on `mst_fixed_stamp`** during response assembly. Pre-
   fetch all needed FixedStampEntity rows in one query keyed on the
   batch's stamp ids.
7. **No `@Transactional`** on `addStamp` — relies on Spring Data's
   per-`save` TX. With `saveAll` that's a single TX, but the
   validation loop is outside it. A request that passes validation
   but then fails at DB-constraint level produces a mid-batch
   exception and partial rollback of the batch (ok), but the caller
   receives a 500 instead of a 400.
8. **`position` is serialized as TEXT** with app-layer JSON. Postgres
   has native `jsonb` — migration would allow server-side queries /
   indexing on position fields.
9. **`pageNumber` is `Long`** in the DTO but the field is `pageNumber`
   in JSON; typical PDFs have < 2^31 pages, so using `Integer` on the
   DTO would suffice. Minor.
10. **`createdOn` serialized as `LocalDateTime.toString()`** (e.g.
    `"2025-11-05T14:22:01.123"`) — not ISO-8601 with timezone. Works
    for the frontend but differs from the Jackson JSR-310 default
    (which would produce the same string anyway). A pattern-pinned
    `@JsonFormat` on the DTO would be more robust.
11. **Uniform 400 for business-logic issues** means a client can't
    distinguish "try again later" from "fix your payload." Combine
    with the `INV001` code issue (§8.2).
12. **Divergence from `mongo-service/service/dms-policy`.** The Mongo
    variant has the same controller shape; stamp persistence in Mongo
    is likely a single document per policy file with an array of
    placements (instead of one row per stamp). Behaviour mirroring
    between the two is only guaranteed for the request/response
    shape, not for transactional semantics.
