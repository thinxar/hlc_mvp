# PolicyFileController — Specification

Upload, download, and endorsement-generation endpoints for policy
files. Combines S3 object storage (`dms-s3`) with the JPA policy model
and a templated-text endorsement generator.

**Module**: `service/dms-policy` (legacy JPA variant)
**Controller**: `com.palmyralabs.dms.controller.PolicyFileController`
**Services**:
* `com.palmyralabs.dms.service.PolicyFileService`
* `com.palmyralabs.dms.service.EndorsementService`

---

## 1. Routing

Class-level mapping:

```java
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")
```

Combined with the Jetty servlet context `/api` (from
`service/dms-main/src/main/resources/application.yaml` →
`server.servlet.context-path: /api`) and the default property value
`palmyra`, the class root becomes `/api/palmyra/policy`.

| Method              | Path (relative)                                    | HTTP   | Full external URL                                                               |
| ------------------- | -------------------------------------------------- | ------ | ------------------------------------------------------------------------------- |
| `downloadFile`      | `/{policyId}/file/{fileId}/download`               | `GET`  | `GET  /api/palmyra/policy/{policyId}/file/{fileId}/download`                    |
| `uploadFile`        | `/{policyId}/docketType/{docketTypeId}/file`       | `POST` | `POST /api/palmyra/policy/{policyId}/docketType/{docketTypeId}/file`            |
| `createEndorsement` | `/{policyId}/endorsement/{docketType}`             | `POST` | `POST /api/palmyra/policy/{policyId}/endorsement/{docketType}`                  |

Security — every endpoint requires an authenticated session (default
`anyRequest().authenticated()` rule from
`service/dms-base/src/main/java/com/palmyralabs/dms/base/config/SecurityConfig.java`).
No method-level `@PreAuthorize` / `@Secured`.

Frontend constants live in `web/src/config/ServiceEndpoint.ts` under
the `policy` namespace.

---

## 2. Endpoints

### 2.1 Download a policy file

```
GET /api/palmyra/policy/{policyId}/file/{fileId}/download
```

Streams the stored S3 object back as the HTTP response body.

| Param      | Type    | Required | Notes                                           |
| ---------- | ------- | -------- | ----------------------------------------------- |
| `policyId` | Integer | yes      | Path — `dms_policy.id` (mapped to DB `bigserial`, controller narrows to `Integer`; practical cap ~2.1B). |
| `fileId`   | Integer | yes      | Path — `dms_policy_file.id` (same narrowing note). |

**Flow** (`PolicyFileService.download`):

1. `policyFileRepository.findByPolicyIdAndId(policyId, fileId)` — returns
   `PolicyFileEntity` or `null`.
2. If null → `DataNotFoundException("INV012", "File record not found")` → 404.
3. If the row's `objectUrl` (S3 key) is null →
   `DataNotFoundException("INV012", "Object url not found")` → 404.
4. Otherwise build a `ResponseFileEmitter(60 * 1000L)` (palmyralabs
   file-mgmt: a long-polling async emitter with a 60 s write timeout)
   and call `AsyncFileService.download(key, emitter)`.
5. Return the emitter — Spring writes bytes as they arrive.

**Response** — binary octet stream (`Content-Type` is NOT re-derived
from the stored `file_type` by this code path; it comes from S3 or
defaults based on the emitter). Status 200 on success.

**Errors**

| Condition                              | HTTP | Body                                            |
| -------------------------------------- | ---- | ----------------------------------------------- |
| Policy+file combo missing              | 404  | `{ errorCode:"INV012", errorMessage:"File record not found" }` |
| Row exists but `object_url` is null    | 404  | `{ errorCode:"INV012", errorMessage:"Object url not found"  }` |
| S3 returns `NoSuchKeyException`        | 404  | handled by `GlobalExceptionHandler` (`NoSuchKeyException` → `notFound`) |
| Other S3 failure                       | 500  | emitter completes with error; typical `IOException` |

### 2.2 Upload a policy file

```
POST /api/palmyra/policy/{policyId}/docketType/{docketTypeId}/file
Content-Type: multipart/form-data
```

| Param           | Type                | Required | Notes                                                |
| --------------- | ------------------- | -------- | ---------------------------------------------------- |
| `policyId`      | Integer (path)      | yes      | `dms_policy.id`.                                     |
| `docketTypeId`  | Integer (path)      | yes      | `mst_document_type.id`.                              |
| `file`          | MultipartFile (form)| yes      | The file bytes. Spring part name is `file`.          |

Spring multipart limits are 25 MB / request and 25 MB / file
(`spring.servlet.multipart.max-file-size` / `max-request-size` in
`service/dms-main/src/main/resources/application.yaml`). nginx caps
at 24 MB (`client_max_body_size` in `nginx/nginx.conf`) — the nginx
cap is tighter, so 24 MB is the real ceiling in production.

**Flow** (`PolicyFileService.upload`):

1. `policyRepository.findById(policyId)` — 404 via
   `DataNotFoundException("INV012", "Policy Record not found")` if absent.
2. Compute S3 folder = `policy.policyNumber` (stringified) and
   initial `objectUrl = "{policyNumber}/{originalFilename}"`.
3. `checkObjectUrlAlreadyExists(...)`:
   * Looks up `dms_policy_file.object_url` for the candidate key.
   * If a row already exists AND the docket type's `code` is NOT
     `"115"` (endorsements), throw
     `InvaidInputException("INV400", "File Already Exists")` → 400.
   * If the docket type code IS `"115"`, auto-rename by appending
     `_1`, `_2`, … before the extension until a non-conflicting
     key is found. So endorsements are additive, everything else is
     unique-per-filename.
4. `SyncFileServiceImpl.upload(folder, fileName, file, listener)` —
   PUTs to S3 (`AWS SDK v2` client configured via `aws.s3.*` in
   `application.yaml`). On success:
   * S3 `HEAD` is re-issued; if `contentLength == 0`, the object is
     deleted and the service throws `IllegalStateException("Uploaded
     file is 0 KB and has been deleted.")` — the outer `try/catch`
     wraps it in
     `InvaidInputException("INV400", "File Upload To S3 failed for …")`
     → 400.
   * Listener's `onSuccess` is a no-op
     (`PolicyFileUploadListener`).
5. `savePolicyFile(fileName, file, policyId, objectUrl, docketTypeId)`:
   Insert a `dms_policy_file` row with the final filename, size,
   MIME type (`file.getContentType()`), policy id, S3 key, and docket
   type.
6. Return plain string body `"completed"` with status 200.

**Response** — `200 OK` with body `completed` (plain text — `ResponseEntity.ok(result)`
where `result = "completed"`). On failure — see errors table.

**Errors**

| Condition                                                 | HTTP | Code / message                                              |
| --------------------------------------------------------- | ---- | ----------------------------------------------------------- |
| `policyId` not found                                      | 404  | `INV012` / "Policy Record not found"                        |
| `docketTypeId` not found (via `getDocketType`)            | 400  | `INV001` / "docketType not found"                           |
| File key collision AND docket code != "115"               | 400  | `INV400` / "File Already Exists"                            |
| S3 upload threw (includes the 0-byte re-check)            | 400  | `INV400` / "File Upload To S3 failed for \<cause\>"         |
| Request > 24 MB (nginx)                                   | 413  | nginx default; request never reaches Spring                 |
| Request > 25 MB (Spring)                                  | 400  | `MaxUploadSizeExceededException`, unhandled → default 500 unless Spring's own handler triggers |

### 2.3 Create endorsement from template

```
POST /api/palmyra/policy/{policyId}/endorsement/{docketType}
Content-Type: application/json
```

Renders a template file (per `endorsementSubType`) with the supplied
form data, then feeds the rendered HTML into the normal upload flow.

| Param        | Type                       | Required | Notes                                                               |
| ------------ | -------------------------- | -------- | ------------------------------------------------------------------- |
| `policyId`   | Integer (path)             | yes      | Target policy.                                                      |
| `docketType` | String (path, var `code`)  | yes      | `mst_document_type.code` — resolved to id server-side. Typically `"115"` (Endorsements). |
| body         | `EndorsementRequest` JSON  | yes      | See below.                                                          |

**Request body** — `com.palmyralabs.dms.model.EndorsementRequest`:

```java
class EndorsementRequest {
    String endorsementSubType;   // e.g. "3543-SA Reduction"
    Object formData;             // free-form JSON object; becomes Map<String,Object>
}
```

Example:

```json
{
  "endorsementSubType": "3543-SA Reduction",
  "formData": {
    "policyNo":    "40002345",
    "name":        "Ms. Priya",
    "oldSa":       "500000",
    "newSa":       "300000",
    "effDate":     "2025-11-01",
    "remarks":     ""
  }
}
```

**Flow** (`EndorsementService.createEndorsement`):

1. Reject empty/null `endorsementSubType` →
   `InvaidInputException("INV012", "endorsementSubType is empty")` → 400.
2. Compute `fileName = "{endorsementSubType}.txt"` (e.g. `"3543-SA Reduction.txt"`).
3. `findParentFolderName(new File(System.getProperty("user.dir")), fileName)` —
   a recursive walk of the current working directory to find a file
   whose name matches (case-insensitive). Returns the name of the
   immediate parent folder, which is then used as the classpath subdir
   prefix.

   So the template lookup is: **file on disk under `user.dir`** to
   derive the folder name, then **classpath** (`getResourceAsStream`)
   using that folder + the filename. Production only works because the
   packaged distribution ships the templates on the classpath AND the
   same directory tree exists under `user.dir`. See §8.
4. Read the template body as UTF-8-ish (`new String(is.readAllBytes())`
   — platform default charset; not explicit).
5. `processFormData`:
   * Convert `request.formData` (arbitrary JSON) to `Map<String, Object>`
     via Jackson.
   * Lower-case every key.
   * Replace null/blank values with the literal `"--"`.
6. `setFormDataValues`:
   * Find every `%%token%%` pattern in the template.
   * Replace with `<b>{value}</b>` (HTML bold wrap) — token is
     looked up lower-case in the form map; missing → empty string.
7. Wrap the rendered bytes in a `MockMultipartFile` with filename
   `"{endorsementSubType}.html"`, content-type `text/html`.
8. Resolve `docketTypeEntity = docketTypeRepo.findByCode(code)` — 400
   (`INV001` / "docketType not found") if missing.
9. `policyFileService.upload(multipartFile, policyId, docketTypeEntity.getId())`
   — same path as 2.2 above, so the endorsement is persisted to S3 and
   `dms_policy_file` exactly like a user upload.
10. Return `"file uploaded successfully"` wrapped in
    `ResponseEntity.ok(...)`.

All internal exceptions are caught and re-thrown as `IOException`
(`throw new IOException(e)`); the controller signature declares
`throws IOException`. `IOException` is NOT mapped in
`GlobalExceptionHandler`, so it reaches Spring's default handler
(500).

**Response**

```
200 OK
file uploaded successfully
```

**Errors**

| Condition                                    | HTTP | Code / message                                          |
| -------------------------------------------- | ---- | ------------------------------------------------------- |
| `endorsementSubType` empty                   | 400  | `INV012` / "endorsementSubType is empty"                |
| Template file not found (on disk or classpath)| 500 | wrapped `IOException(fileName + " not found in classpath under" + folderName)` |
| `docketType` code unknown                    | 400  | `INV001` / "docketType not found"                       |
| Uploaded-as-HTML collision with non-`115` code| 400 | `INV400` / "File Already Exists" (from inner upload)    |
| S3 failure                                   | 400  | `INV400` / "File Upload To S3 failed for …"             |

---

## 3. Validation / error responses — summary

Codes emitted by this controller path (via `InvaidInputException` or
`DataNotFoundException`; mapped through `GlobalExceptionHandler` in
`service/dms-base/src/main/java/com/palmyralabs/dms/base/handler/GlobalExceptionHandler.java`):

| Code    | Meaning                                                  | HTTP |
| ------- | -------------------------------------------------------- | ---- |
| `INV012`| Missing record (policy / file / object-url / subType)    | 404 (for `DataNotFoundException`) / 400 (for `InvaidInputException` with this code — see `endorsementSubType` empty) |
| `INV001`| Master-data lookup failed (`docketType not found`)        | 400  |
| `INV400`| S3 upload failed / file already exists                   | 400  |
| `Others`| Any other runtime exception (`ErrorResponse` fallback)   | 500 default (unless `GlobalExceptionHandler` matches a type) |

Global mapping reference is documented once in
`claude/specs/service/dms_base/base/BaseController.md` §3.1.

---

## 4. Service contract

```java
// PolicyFileService
ResponseFileEmitter download(Integer policyId, Integer fileId);
String               upload  (MultipartFile file, Integer policyId, Integer docketTypeId);

// EndorsementService
String createEndorsement(EndorsementRequest request, Integer policyId, String code) throws IOException;
```

Inside `PolicyFileService`:

```java
// injected:
AsyncFileService      fileService;        // impl: palmyralabs async S3 (for download)
SyncFileServiceImpl   syncFileService;    // S3 PUT path (for upload)
PolicyFileRepository  policyFileRepository;
PolicyRepository      policyRepository;
DocumentTypeRepository docTypeRepository;
```

Inside `EndorsementService`:

```java
// injected:
PolicyFileService      policyFileService;
DocumentTypeRepository docketTypeRepo;

// constants:
String inputExtension  = ".txt";
String outputExtension = ".html";
```

---

## 5. Data model

### 5.1 Entities

| Entity                                                                                                 | Table                 | Used for                                 |
| ------------------------------------------------------------------------------------------------------ | --------------------- | ---------------------------------------- |
| `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/PolicyEntity.java`                       | `dms_policy`          | Resolve `policyNumber` (folder name).     |
| `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/PolicyFileEntity.java`                   | `dms_policy_file`     | Upsert/lookup by (`policyId`,`id`) or `object_url`. |
| `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/DocumentTypeEntity.java`                 | `mst_document_type`   | Resolve `code` <-> id; special-case `"115"` endorsement. |

Key columns (see `dbscripts/006.dms.sql` + `alter_11_05.sql`):

```
dms_policy_file (
  id bigserial PK,
  policy_id int8 NOT NULL,         -- FK -> dms_policy.id
  file_name varchar(128),
  file_size int8,
  file_type varchar(32),
  docket_type int8,                -- FK -> mst_document_type.id
  object_url varchar(500) UNIQUE,  -- S3 key (see note below)
  created_by, created_on, last_upd_by, last_upd_on
)
```

The unique constraint on `object_url` is the backstop behind
`checkObjectUrlAlreadyExists`; the code-level check just gives a
better error message.

### 5.2 Repositories

```java
// PolicyFileRepository
PolicyFileEntity  findByPolicyIdAndId(Integer policyId, Integer fileId);
Optional<PolicyFileEntity> findByObjectUrl(String objectUrl);
Optional<PolicyFileEntity> findById(Long id);

// PolicyRepository
Optional<PolicyEntity> findById(Integer id);   // note: narrowed Integer overload
Optional<PolicyEntity> findById(Long id);      // inherited from JpaRepository<PolicyEntity, Integer> - see §8

// DocumentTypeRepository
Optional<DocumentTypeEntity> findByCode(String code);
Optional<DocumentTypeEntity> findById(Long id);
```

### 5.3 DTOs

* `EndorsementRequest` — `{ endorsementSubType, formData }`.
* `PolicyFileModel` (used by the `DmsPolicyFileHandler`, not by this
  controller) — read-side palmyralabs-DSL mapping of the entity with
  a virtual `fixedStamp` field. Definition:
  `service/dms-policy/src/main/java/com/palmyralabs/dms/model/PolicyFileModel.java`.
* `PolicyModel` — palmyralabs DSL model for the policy row. Definition:
  `service/dms-policy/src/main/java/com/palmyralabs/dms/model/PolicyModel.java`.

### 5.4 Endorsement template format

Plain text files with `%%token%%` placeholders. Tokens are resolved
case-insensitively (lower-cased both sides). Missing/blank values
become `--` (literal). Resolved values are wrapped in `<b>` tags —
so the output is HTML even though the template is `.txt`.

---

## 6. Dependencies / side-effects

### 6.1 DB

| Operation            | Tables read                                  | Tables written         |
| -------------------- | -------------------------------------------- | ---------------------- |
| `downloadFile`       | `dms_policy_file`                            | — (read-only)          |
| `uploadFile`         | `dms_policy`, `dms_policy_file`, `mst_document_type` | `dms_policy_file` (insert) |
| `createEndorsement`  | `mst_document_type`                          | `dms_policy_file` (insert, via inner `uploadFile` logic) |

### 6.2 S3

* Bucket, region, keys, endpoint, pool sizes: `aws.s3.*` in
  `service/dms-main/src/main/resources/application.yaml`.
* Client built by palmyralabs `dms-s3` lib (`S3Config`).
* `SyncFileServiceImpl.upload`:
  1. `PutObjectRequest` with content-type from `MultipartFile`.
  2. `HeadObjectRequest` post-check; if 0-byte, `DeleteObjectRequest` + throw.
* `AsyncFileServiceImpl` (not shown in this spec) handles the download
  streaming.
* `NoSuchKeyException` from AWS SDK is globally mapped to 404 by
  `GlobalExceptionHandler`.

### 6.3 Filesystem

`EndorsementService.findParentFolderName` walks `user.dir`
recursively. In containerized runs `user.dir` is the app's working
directory — the docker images in `service/dms-main/` run from
`/app` by default; templates live on the classpath (see the 78 files
under `service/dms-main/src/main/resources/templates/`). This walk is
solely used to derive the folder name for the `getResourceAsStream`
call; the disk read itself does not consume the file content.

### 6.4 Security / session

Session-based auth only; see
`claude/specs/service/dms_admin/auth/AuthenticationController.md`.
No per-endpoint ACL, no row-level policy check — a user who can hit
the endpoint can download any file id if they know the id. See §8.

### 6.5 `@EnableAsync` / async

Declared at `AppMain` scope. This controller does not use `@Async`
directly, but `AsyncFileService.download` (palmyralabs impl) uses the
S3 async client and emits bytes through `ResponseFileEmitter` with a
60 s write timeout.

---

## 7. Example requests

```bash
# Upload a PDF
curl -i -b cookies.txt \
     -F 'file=@/tmp/policy.pdf' \
     http://localhost:7070/api/palmyra/policy/15/docketType/1/file
# -> 200 'completed'

# Upload an endorsement (auto-renames on collision)
curl -i -b cookies.txt \
     -F 'file=@/tmp/end.pdf' \
     http://localhost:7070/api/palmyra/policy/15/docketType/15/file
# -> 200 'completed'  (docket type 15 has code '115' -> _1/_2/... rename)

# Collision on non-endorsement docket type
curl -i -b cookies.txt \
     -F 'file=@/tmp/policy.pdf' \
     http://localhost:7070/api/palmyra/policy/15/docketType/1/file
# -> 400 { "errorCode":"INV400", "errorMessage":"File Already Exists" }

# Download
curl -i -b cookies.txt -o /tmp/download.pdf \
     http://localhost:7070/api/palmyra/policy/15/file/273/download
# -> 200 (streaming octet-stream)

# Download: unknown file id
curl -i -b cookies.txt \
     http://localhost:7070/api/palmyra/policy/15/file/999999/download
# -> 404 { "errorCode":"INV012", "errorMessage":"File record not found" }

# Generate endorsement
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{
           "endorsementSubType":"3543-SA Reduction",
           "formData":{ "policyNo":"40002345", "name":"Priya", "effDate":"2025-11-01" }
         }' \
     http://localhost:7070/api/palmyra/policy/15/endorsement/115
# -> 200 'file uploaded successfully'
```

---

## 8. Known caveats / open items

1. **`EndorsementService.findParentFolderName` is a filesystem walk**
   that starts from `user.dir`. In a jar-only distribution (no
   on-disk templates next to the working dir), this returns `null` and
   the classpath lookup path ends up as `/{fileName}` — often misses.
   The legacy deploy sidesteps it because Gradle `installDist`
   unpacks resources; changing the build shape (fat-jar, etc.) will
   break endorsements. Replace with a hardcoded classpath prefix
   (`/templates/`) or a `Set<String>` registry.
2. **Template charset is not specified.** `new String(is.readAllBytes())`
   uses the JVM default. On Windows that is cp1252, on Linux usually
   UTF-8; differences will mangle accented names. Explicit `StandardCharsets.UTF_8`
   needed.
3. **Endorsement output is HTML but filename ends `.html`** while the
   content-type is set to `text/html` — safe, but the original source
   extension is `.txt` containing HTML fragments. Awkward mix.
4. **Endorsement success message is `"file uploaded successfully"`** —
   a plain string with no structure. Inconsistent with most other
   endpoints that return typed bodies.
5. **Docket-code `"115"` is hardcoded** as the sentinel for "allow
   rename on collision." Endorsements happen to have that code today;
   the logic should live on the master-data row (e.g. a boolean
   column `allow_duplicate_upload`) rather than string-compared in
   `checkObjectUrlAlreadyExists`.
6. **`PolicyRepository` extends `JpaRepository<PolicyEntity, Integer>`**
   but `PolicyEntity.id` is `Long` and `dms_policy.id` is
   `bigserial`. The Integer type parameter clamps the inherited
   `findById(Integer)` to the wrong width. Controller passes an
   `Integer`, so `policyRepository.findById(policyId)` autoboxes it;
   works until an id overflows 2^31, at which point calls fail to
   find the row. Change the repository type to `Long`.
7. **`PolicyFileRepository.findByPolicyIdAndId(Integer, Integer)`** —
   same Integer-width issue. Method signature declares Integer,
   entity's `id` is `Long`. Derived query works via JPA coercion but
   should be Long.
8. **S3 upload throws an undeclared checked exception via
   `@SneakyThrows`.** `SyncFileServiceImpl.upload` is declared as
   `throws Exception` effectively via Lombok. The outer
   `PolicyFileService.upload` catches `Exception`, which hides the
   actual root cause. Use a typed S3 wrapper.
9. **`ResponseFileEmitter(60000)` — 60 s write timeout.** Large-file
   downloads can exceed this on slow networks; nginx has a 300 s
   `proxy_read_timeout`, but the emitter-side 60 s is the tighter
   limit. Consider configurable.
10. **No content-type validation on upload.** A user can upload a
    `.exe` with `Content-Type: application/pdf`; the server stores
    exactly what Spring hands it. Master-data check, MIME-type
    whitelist, or magic-byte scan would mitigate.
11. **No ownership check on download.** Any authenticated user can
    download any file if they know `policyId` + `fileId`. Should be
    scoped by the user's role / branch / division.
12. **`EndorsementService.createEndorsement` wraps every exception
    into `IOException`** (`catch (Exception e) { throw new IOException(e); }`),
    which `GlobalExceptionHandler` does NOT map — it falls through to
    a generic 500. Either let the typed exceptions propagate or add an
    `@ExceptionHandler(IOException.class)` mapping.
13. **`PolicyFileUploadListener.onSuccess` is empty** — any audit,
    trigger, or notification that should fire on upload has no home.
14. **Divergence from `mongo-service/service/dms-policy`.** The Mongo
    variant splits file paths across `PolicyFileController` and a new
    `PolicyFileAttachmentController` and has a richer `PolicyController`.
    The legacy controller here only covers the three original
    operations. Any new endpoint added to the Mongo side must be
    evaluated against this one.
