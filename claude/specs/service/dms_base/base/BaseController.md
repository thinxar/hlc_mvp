# BaseController — Specification

Abstract base class used by every `@RestController` / `@Controller` in
the legacy JPA backend. Does NOT declare any `@RequestMapping`; it
provides three kinds of helpers:

1. a single `asJson` pass-through to palmyralabs
   `NativeQueryExportService` (for native-SQL endpoints), and
2. a family of `ResponseEntity<R>` factory methods that build
   uniform 200/404/400/401/403/204 responses, and
3. a paired family that accepts an `ErrorResponse` body for the
   4xx cases.

`GlobalExceptionHandler` in
`service/dms-base/src/main/java/com/palmyralabs/dms/base/handler/GlobalExceptionHandler.java`
extends this class and reuses the same 4xx helpers to map typed
exceptions to HTTP codes — so `BaseController` is effectively also the
base for the global error advice.

**Module**: `service/dms-base` (legacy JPA variant)
**Class**:  `com.palmyralabs.dms.base.controller.BaseController` (abstract)
**Subclasses (direct or transitive, in this repo)**:

| Subclass                                                                    | Location                                                   |
| --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `com.palmyralabs.dms.admin.controller.AclMenuController`                    | `service/dms-admin/.../controller/AclMenuController.java`  |
| `com.palmyralabs.dms.admin.controller.AuthenticationController`             | `service/dms-admin/.../controller/AuthenticationController.java` |
| `com.palmyralabs.dms.base.handler.GlobalExceptionHandler`                   | `service/dms-base/.../handler/GlobalExceptionHandler.java` |

`PasswordController` (dms-admin) and the three `dms-policy` controllers
do NOT extend `BaseController` — they are free to use `ResponseEntity`
directly or extend palmyralabs `AbstractController`
(`PolicyFileStampController`) instead.

---

## 1. Routing

`BaseController` has no `@RequestMapping`. It is `abstract`, never a
Spring bean by itself, and never routed to. All routing decisions live
on the subclass. This section exists only to note that the Jetty
servlet context `/api` and the `${palmyra.servlet.prefix-path:palmyra}`
prefix are applied entirely by the subclass's own `@RequestMapping` (or
not, for controllers with absolute paths).

---

## 2. "Endpoints" (helper methods)

Because this is not a controller by itself, the usual per-method table
becomes a helper-method table.

### 2.1 `asJson(NativeQueryResponse query)` — streaming native-SQL JSON

```java
protected void asJson(NativeQueryResponse query) {
    exportService.asJson(query);
}
```

Delegates to palmyralabs `NativeQueryExportService.asJson(...)`, which
executes the SQL in `query` and streams the rows to the current HTTP
response as a JSON array (column name → value per row).

* `NativeQueryResponse` — constructed with a raw SQL string plus
  positional params. Example:
  `new NativeQueryResponse("SELECT id, name FROM ...", user)`.
* `exportService` is injected via a setter + `@Autowired` (not
  constructor injection — `BaseController` is abstract and
  `@Autowired` setters work even when the subclass doesn't define a
  constructor mentioning it).
* The subclass returns `void` from its `@GetMapping` / `@PostMapping`
  when using `asJson` — the response is already written.

The sole caller in this repo is `AclMenuController`
(`service/dms-admin/.../controller/AclMenuController.java`).

### 2.2 `response(R val)` / `response(Optional<R> val)`

```java
protected final <R> ResponseEntity<R> response(R val);
protected final <R> ResponseEntity<R> response(Optional<R> val);
```

* `null` (or empty Optional) → `ResponseEntity<>(HttpStatus.NOT_FOUND)` (404, empty body).
* non-null → `ResponseEntity<>(val, HttpStatus.OK)` (200).

Thin guard against returning `null` from a controller (which Spring
would otherwise serialize as body `"null"` with 200).

### 2.3 `ok()` / `ok(R val)` — 200 responses

```java
protected final ResponseEntity<Void> ok();
protected final <R> ResponseEntity<R> ok(R val);
```

No body vs typed body.

### 2.4 `noContent()` — 204

```java
protected final ResponseEntity<Void> noContent();
```

### 2.5 4xx helpers — body and no-body variants

```java
protected final ResponseEntity<ErrorResponse> notFound(ErrorResponse r);       // 404
protected final ResponseEntity<ErrorResponse> alreadyExists(ErrorResponse r);  // 400 (see §7)
protected final ResponseEntity<ErrorResponse> unauthorized(ErrorResponse r);   // 401
protected final ResponseEntity<Void>          unauthorized();                  // 401 (no body)
protected final ResponseEntity<ErrorResponse> forbidden(ErrorResponse r);      // 403
protected final ResponseEntity<Void>          forbidden();                     // 403 (no body)
```

`GlobalExceptionHandler` extends `BaseController` and adds its own
`badRequest(ErrorResponse r)` (400); that method is not defined on
`BaseController` itself.

### 2.6 Method visibility

Every helper (apart from `asJson` and the `setExportService` setter)
is `protected final` — subclasses call them but can't override them.
That keeps the response-shape contract uniform across the codebase.

---

## 3. Validation / error responses

`BaseController` is not called by the web framework directly, so there
are no routed validations. The helpers it provides are used to emit
error responses with a uniform shape:

```json
{
  "errorCode":    "INV001",
  "errorMessage": "stamp not found"
}
```

Shape is defined by
`service/dms-base/src/main/java/com/palmyralabs/dms/base/model/ErrorResponse.java`:

```java
@Getter @AllArgsConstructor
public class ErrorResponse {
    private String errorCode;
    private String errorMessage;
}
```

### 3.1 How `GlobalExceptionHandler` uses these helpers

`GlobalExceptionHandler extends BaseController` means the advice class
calls `notFound(...)`, `unauthorized(...)`, `forbidden(...)`,
`alreadyExists(...)` (as `400`), and adds its own `badRequest(...)` for
fresh 400s. The mapping table (for reference from every other spec in
this repo):

| Exception                                                | HTTP | Helper              |
| -------------------------------------------------------- | ---- | ------------------- |
| `DataNotFoundException`, `ResourceNotFoundException`, `NoSuchKeyException` | 404 | `notFound(...)`     |
| `ResourceAlreadyExistsException`                         | 400  | `alreadyExists(...)`|
| `UnAuthorizedException`                                  | 401  | `unauthorized(...)` |
| `EndPointForbiddenException`                             | 403  | `forbidden(...)`    |
| `InvaidInputException`, `FieldValidationException`, `DateTimeException`, `MultipleTuplesExistsException` | 400 | `badRequest(...)` (on handler only) |

Every error-response body is built by:

```java
// for PalmyraException children — gets code from e.getErrorCode()
return new ErrorResponse(e.getErrorCode(), e.getMessage());

// for everything else (e.g. NoSuchKeyException)
return new ErrorResponse("Others", e.getMessage());
```

So arbitrary `RuntimeException`s that slip through get `errorCode = "Others"`.

---

## 4. Service contract

None. `BaseController` collaborates with exactly one Spring bean:

```java
@Autowired
public void setExportService(NativeQueryExportService exportService);
```

`NativeQueryExportService` comes from the palmyralabs `palmyra-core`
library. The project does not declare a `@Bean` for it — it's
contributed automatically by `PalmyraSpringConfiguration` (imported in
`service/dms-main/src/main/java/com/palmyralabs/dms/AppMain.java`).

---

## 5. Data model

### 5.1 `ErrorResponse`

File:
`service/dms-base/src/main/java/com/palmyralabs/dms/base/model/ErrorResponse.java`.

```java
{ errorCode: String, errorMessage: String }
```

Used by every 4xx response emitted through `GlobalExceptionHandler`.

### 5.2 `NativeQueryResponse` (palmyralabs)

From `com.palmyralabs.palmyra.handlers.NativeQueryResponse` (not in
this repo). Holds a SQL string plus varargs params. Constructed inline
(see `AclMenuQuery.getParentMenu(user)`), passed to `asJson`.

### 5.3 No JPA entity, no DTO of its own (beyond `ErrorResponse`).

---

## 6. Dependencies / side-effects

### 6.1 DB / S3 / async
None at this layer. The `asJson` path reaches the DB via
`NativeQueryExportService`, but that is injected externally.

### 6.2 Security
None directly. The Spring Security filter chain runs before the
controller is invoked; `BaseController` never queries the
`SecurityContext`.

### 6.3 Commented-out code

Two blocks are commented out:

1. `private RequestInfoProvider requestInfoProvider;` + its setter —
   indicates an earlier intent to read servlet request attributes.
2. An `export(query, writerFactory)` method that would look at a
   `_format` query parameter and dispatch to a custom writer. Never
   enabled.

Safe to delete.

### 6.4 Framework coupling
Imports `org.springframework.http.HttpStatus` + `ResponseEntity` only
— no Jetty-specific code, so the base is reusable if the container
ever changes.

---

## 7. Example flows (how subclasses use these helpers)

```java
// 200 with typed body
return ok(loginResponse);

// 200 no body (e.g. after a mutation)
return ok();

// 204 (rare in this codebase)
return noContent();

// 404 with body
return notFound(new ErrorResponse("INV012", "Policy record not found"));

// 401 without body  — used by AuthenticationController.ChangePassword failure path
return unauthorized();

// 403 with body — e.g. ACL failure
return forbidden(new ErrorResponse("USER002", "not permitted"));
```

Example flow from `GlobalExceptionHandler` (advice, not a routed
controller):

```java
@ExceptionHandler(DataNotFoundException.class)
public ResponseEntity<ErrorResponse> dataNotFoundException(DataNotFoundException e) {
    return notFound(getErrorResponse(e));       // -> 404 + ErrorResponse
}
```

---

## 8. Known caveats / open items

1. **`alreadyExists(ErrorResponse)` returns 400, not 409.** Misleading
   method name — HTTP 409 (Conflict) is the canonical "already exists"
   code. Changing it would be a breaking API change; rename to
   `conflict(...)` and deprecate the old entry point.
2. **No `badRequest(...)` on the base class itself.** It lives only on
   `GlobalExceptionHandler`. Controllers that want to emit a 400 with
   an `ErrorResponse` body today either call `alreadyExists(...)`
   (semantically misleading) or build the `ResponseEntity` by hand.
   Promote `badRequest` from the handler to the base.
3. **`setExportService` uses setter injection** while every other
   subclass uses constructor injection via Lombok `@RequiredArgsConstructor`.
   Inconsistent but unavoidable — can't put an `@Autowired` constructor
   on an abstract class without forcing subclass constructors to
   super-call with the dependency.
4. **The unused `RequestInfoProvider` / `export` blocks** still sit in
   the source. Either wire them up or delete them — they create the
   false impression of a pluggable export format that never existed.
5. **`asJson` does not set `Content-Type`** at this layer — it relies
   on `NativeQueryExportService` to do so. If a future refactor swaps
   that service, double-check content-type is preserved.
6. **Empty body for 401/403** in the no-body helpers. Some clients
   (web + mobile) would benefit from an `ErrorResponse` body on every
   4xx; consider making the no-body variants deprecated.
7. **No difference between "null result" and "missing record"** in
   `response(R)` — both become 404. That's fine for REST but collapses
   two distinct server states. Callers that need to distinguish should
   throw `DataNotFoundException` instead of returning null and let the
   handler assemble the error payload.
8. **Divergence from `mongo-service/service/dms-base`** — the Mongo
   variant has the same `BaseController` shape, identical helper
   signatures. Any change here should land in both repos; the
   `ErrorResponse` shape is consumed by a shared React frontend
   (`web/src/wire/StoreFactory.ts`).
