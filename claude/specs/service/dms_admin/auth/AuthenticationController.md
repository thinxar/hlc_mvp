# AuthenticationController — Specification

Session-cookie auth surface: login, logout, user-initiated password
change, and admin-initiated password reset. Thin wrapper over the
palmyralabs `palmyra-ext-usermgmt` primitives (`LocalDBAuthenticationProvider`,
`PasswordMgmtService`) plus the project's `UserService` for the
login-response enrichment.

**Module**: `service/dms-admin` (legacy JPA variant)
**Controller**: `com.palmyralabs.dms.admin.controller.AuthenticationController`
**Services used**:
* `com.palmyralabs.dms.admin.service.UserService`
* `com.palmyralabs.palmyra.ext.usermgmt.service.PasswordMgmtService` (external lib)
* `com.palmyralabs.palmyra.ext.usermgmt.security.LocalDBAuthenticationProvider` (external lib)

---

## 1. Routing

No class-level `@RequestMapping` — every path is declared on the method.

| Method          | External path                        | HTTP verbs       |
| --------------- | ------------------------------------ | ---------------- |
| `login`         | `/api/auth/login`                    | `POST`           |
| `logout`        | `/api/auth/logout`                   | `GET`, `POST`    |
| `ChangePassword`| `/api/user/changePassword`           | `POST`           |
| `ResetPassword` | `/api/admin/resetPassword`           | `POST`           |

These paths live directly under the servlet context `/api` — they do
NOT get the `${palmyra.servlet.prefix-path}` prefix applied, because
the mappings are absolute (`/auth/login` etc.) and the controller has
no class-level prefix.

Security matrix (`service/dms-base/src/main/java/com/palmyralabs/dms/base/config/SecurityConfig.java`):

* `/auth/login` — `permitAll()` (explicitly whitelisted).
* All other endpoints — `anyRequest().authenticated()`. `/auth/logout`,
  `/user/changePassword`, `/admin/resetPassword` therefore require an
  active session.

CSRF is disabled globally (`http.csrf(t -> t.disable())`).

---

## 2. Endpoints

### 2.1 `POST /api/auth/login`

Authenticates, opens a session, returns the user's display page key.

**Request body** (`com.palmyralabs.palmyra.ext.usermgmt.model.LoginRequest`,
external):

```json
{ "userName": "admin", "password": "Passw0rd!" }
```

**Flow**:

1. Build an unauthenticated `UsernamePasswordAuthenticationToken`.
2. Delegate to `LocalDBAuthenticationProvider.authenticate(token)`.
   This provider reads the user record via
   `com.palmyralabs.palmyra.ext.usermgmt.repository.UserPasswordRepository`,
   whose project implementation is
   `service/dms-admin/src/main/java/com/palmyralabs/dms/admin/dbpwd/UserPasswordRepoImpl.java`
   (random+password MD5 combo — see `PasswordService` for the hashing
   contract).
3. If authenticated, call `userService.isUserActive(loginName)`. If
   the row has `active != 1`, throw
   `UnAuthorizedException("USER001", "This user account has been deactivated.")`.
4. Materialize a new `SecurityContext`, set the `Authentication`, save
   it through the injected `SecurityContextRepository`. That repo is
   the delegating chain built in `SecurityConfig` — a
   `RequestAttributeSecurityContextRepository` primary with the
   `HttpSessionSecurityContextRepository`
   (from `SecurityConfigRepositoryConfig`) as fallback. Net effect: the
   session cookie `JSESSIONID` holds the context between calls.
5. Load the user row by login name via
   `userService.getLoginNameAndDisplayPage(loginName)` and return a
   `LoginResponse`.

**Response body** (`com.palmyralabs.dms.admin.security.LoginResponse`):

```json
{
  "displayPage": "DASHBOARD",
  "loginName":   "admin",
  "accessToken": null
}
```

* `displayPage` — the `xpm_menu.code` of the user's `display_page` FK,
  or `null` if unset.
* `loginName` — echo of the stored login name (case normalized to DB).
* `accessToken` — field exists on the DTO but is never populated by
  `UserService` (session-cookie auth; no bearer token issued).

**HTTP** — 200 on success.

### 2.2 `POST /api/user/changePassword`

Self-service password change. Caller must be authenticated AND must be
changing **their own** password.

**Request body** (`com.palmyralabs.palmyra.ext.usermgmt.model.ChangePasswordRequest`,
external). Typical shape:

```json
{
  "loginName":   "kmurugan",
  "oldPassword": "Previous!1",
  "newPassword": "Secret!23"
}
```

(Exact field names come from the palmyralabs lib — the request is
deserialized by Jackson from that model.)

**Flow**:

1. `isCurrentUser(changePwdRequest)` — compares
   `userProvider.getUser()` (from `AuthProvider`, i.e. the
   SecurityContext principal) against `changePwdRequest.getLoginName()`
   case-insensitively. Rejects cross-user changes.
2. `passwordService.changePassword(changePwdRequest)` — palmyralabs
   service that verifies the old password and re-hashes the new one
   (ultimately writes via `UserPasswordRepoImpl.update` — persists
   `password` into `xpm_user.salt` and `xpm_user.random`).

**Return codes**:

| Condition                                          | HTTP |
| -------------------------------------------------- | ---- |
| Both checks pass                                   | 200 OK (empty body) |
| `isCurrentUser = false` OR `changePassword = false`| 401 Unauthorized (empty body) |

The 401 is emitted via `BaseController.unauthorized()` — no body.

### 2.3 `POST /api/admin/resetPassword`

Admin-initiated password reset for another user.

**Request body** (`com.palmyralabs.palmyra.ext.usermgmt.model.ResetPasswordRequest`,
external):

```json
{
  "loginName":   "jdoe",
  "newPassword": "Welcome!234"
}
```

**Flow**:

1. `isAdminUser()` — **currently returns `true` unconditionally**:

   ```java
   private boolean isAdminUser() {
       // TODO add role-check here
       return true;
   }
   ```

   Any authenticated user can call this endpoint today. See §8.

2. `passwordService.resetPassword(...)` — palmyralabs service; rewrites
   `xpm_user.salt` / `xpm_user.random` via `UserPasswordRepoImpl.update`.

**Return codes**:

| Condition                       | HTTP |
| ------------------------------- | ---- |
| Both checks pass                | 200 OK (empty body) |
| Either check returns `false`    | 403 Forbidden (empty body) |

### 2.4 `GET|POST /api/auth/logout`

Ends the current session.

Delegates to a field-initialized
`SecurityContextLogoutHandler.logout(request, response, authentication)`.
This clears the `SecurityContext`, invalidates the HTTP session, and
optionally clears the remember-me cookie (remember-me is not
configured, so no-op). Returns `void` with implicit 200.

---

## 3. Validation / error responses

### 3.1 Directly thrown

| Exception                                                      | Trigger                                                            | Result |
| -------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| `UnAuthorizedException("USER001", "Invalid Credientials")`      | `LocalDBAuthenticationProvider.authenticate()` returns null/unauthenticated | 401 via `GlobalExceptionHandler.unauthorizedException(UnAuthorizedException)` |
| `UnAuthorizedException("USER001", "This user account has been deactivated.")` | Valid password but `xpm_user.active != 1` | 401 via same handler |

Note the typo ("Credientials") is in the source. Also note both cases
use the same error code `USER001` — the frontend distinguishes them by
the message string.

### 3.2 Indirect

* `LocalDBAuthenticationProvider` may throw its own
  `AuthenticationException` subtypes (e.g. `BadCredentialsException`).
  These are NOT caught in the controller; they propagate to Spring
  Security's entry point and result in 401 (via `HttpStatusEntryPoint`).
* Any other runtime error during login falls through
  `GlobalExceptionHandler` — `DateTimeException`, `FieldValidationException`
  etc. → 400; uncaught → 500.

### 3.3 Global mapping reference

See
`service/dms-base/src/main/java/com/palmyralabs/dms/base/handler/GlobalExceptionHandler.java`
for the project-wide exception→HTTP mapping. Relevant entries for this
controller:

| Exception                       | HTTP |
| ------------------------------- | ---- |
| `UnAuthorizedException`         | 401  |
| `EndPointForbiddenException`    | 403  |
| `InvaidInputException`, `FieldValidationException` | 400 |
| `DataNotFoundException`, `ResourceNotFoundException`, `NoSuchKeyException` | 404 |
| `ResourceAlreadyExistsException`| 400  |
| `DateTimeException`             | 400  |
| `MultipleTuplesExistsException` | 400  |

---

## 4. Service contract

```java
// UserService (project-local, service/dms-admin/.../service/UserService.java)
Optional<UserEntity> findUserByLoginName(String loginName);
void                 setLoginNameAndDisplayPage(String email, String loginName, MenuEntity displayPage);
LoginResponse        getLoginNameAndDisplayPage(String loginName);   // used by login()
boolean              isUserActive(String loginName);                 // used by login()

// PasswordMgmtService (external: palmyra-ext-usermgmt)
boolean changePassword(ChangePasswordRequest request);
boolean resetPassword(ResetPasswordRequest request);

// LocalDBAuthenticationProvider (external: palmyra-ext-usermgmt)
Authentication authenticate(Authentication token);

// AuthProvider (external: palmyra-store-base)
String getUser();

// SecurityContextRepository (Spring Security)
void saveContext(SecurityContext, HttpServletRequest, HttpServletResponse);

// SecurityContextLogoutHandler (Spring Security)
void logout(HttpServletRequest, HttpServletResponse, Authentication);
```

`UserService.getLoginNameAndDisplayPage` returns `null` when the user
row is missing — in login flow that cannot happen (`authenticate` just
succeeded), but callers should be aware.

---

## 5. Data model

### 5.1 Entity — `UserEntity`

Table `xpm_user` — see
`service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/UserEntity.java`.

| Field              | Column           | Role                                 |
| ------------------ | ---------------- | ------------------------------------ |
| `id` (Integer)     | `id`             | Primary key                          |
| `loginName`        | `login_name`     | Unique, used by auth                 |
| `displayName`      | `display_name`   | Unique                               |
| `displayPage`      | `display_page` (FK → `xpm_menu`) | Determines `LoginResponse.displayPage` |
| `email`            | `email`          | Unique                               |
| `random`           | `random`         | 128-char per-user salt               |
| `password`         | `salt`           | MD5(`random` + raw password)         |
| `active`           | `active`         | `1` = active, anything else blocked  |
| `createdBy`/`createdOn`/`lastUpdBy`/`lastUpdOn` | audit | Populated elsewhere (master-data CRUD) |

DDL reference: `dbscripts/001.create.sql`.

### 5.2 Entity — `MenuEntity` (for `displayPage`)

Table `xpm_menu`. Only `id`, `name`, `code` are mapped on the Java
entity — the `LoginResponse.displayPage` ends up being `code`.

### 5.3 DTOs

#### `LoginResponse`

File:
`service/dms-admin/src/main/java/com/palmyralabs/dms/admin/security/LoginResponse.java`.

```java
class LoginResponse {
    String displayPage;
    String loginName;
    String accessToken;   // never set
}
```

#### `LoginRequest` / `ChangePasswordRequest` / `ResetPasswordRequest`

All three come from `com.palmyralabs.palmyra.ext.usermgmt.model.*` in
the external `palmyra-ext-usermgmt` jar. Not reproduced here — inspect
the dependency artifact for exact field names. Minimally:

* `LoginRequest` — `userName`, `password`.
* `ChangePasswordRequest` — has `loginName` at minimum (used by
  `isCurrentUser`). Old + new password fields.
* `ResetPasswordRequest` — has `loginName` + a new-password field.

### 5.4 Password storage convention

`UserPasswordRepoImpl.findByLoginName` maps:

```
UserEntity.random   → UserPasswordModel.random
UserEntity.password → UserPasswordModel.salt   (note: intentional column/field swap)
```

So the Java field `password` is persisted into a column literally named
`salt`. The hash itself is MD5 of (`random` + raw password). See the
sibling `PasswordController` spec and
`service/dms-admin/src/main/java/com/palmyralabs/dms/admin/service/PasswordService.java`
for the detailed formula.

---

## 6. Dependencies / side-effects

### 6.1 DB

| Operation           | Tables hit                    | Writes? |
| ------------------- | ----------------------------- | ------- |
| `login`             | `xpm_user` (read, twice — auth + active check + display page)  | No    |
| `changePassword`    | `xpm_user` (read + write `salt`, `random`) | Yes   |
| `resetPassword`     | `xpm_user` (read + write `salt`, `random`) | Yes   |
| `logout`            | — (session invalidation only) | No    |

All writes go through `UserPasswordRepoImpl.update` which saves the
whole `UserEntity` via `JpaRepository.save` (managed by audit
listener — `createdOn`/`lastUpdOn` auto-populated; see
`dbscripts/001.create.sql`).

### 6.2 Session

Session-based auth only. The flow:

1. `login` creates + saves a `SecurityContext` against the combined
   repo (`RequestAttributeSecurityContextRepository` + `HttpSessionSecurityContextRepository`).
2. The session cookie (`JSESSIONID`, default Jetty name) carries the
   session id; subsequent requests rehydrate the context.
3. `logout` invalidates the session via `SecurityContextLogoutHandler`.
4. Session timeout is 220 minutes
   (`server.servlet.session.timeout` in
   `service/dms-main/src/main/resources/application.yaml`).

No bearer tokens, no JWT. The `accessToken` field on `LoginResponse`
is vestigial.

### 6.3 External services

None. No S3 writes, no message queue, no outbound HTTP.

### 6.4 `@EnableAsync`

Declared on `AppMain` but nothing on this controller uses it.

---

## 7. Example requests

```bash
# Log in (note: 'userName', not 'username')
curl -i -c cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{"userName":"admin","password":"Passw0rd!"}' \
     http://localhost:7070/api/auth/login
# -> 200 { "displayPage":"DASHBOARD","loginName":"admin","accessToken":null }

# Change my own password
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{"loginName":"admin","oldPassword":"Passw0rd!","newPassword":"Secret!2345"}' \
     http://localhost:7070/api/user/changePassword
# -> 200  (empty body)

# Attempt to change someone else's password -> 401
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{"loginName":"jdoe","oldPassword":"x","newPassword":"Secret!2345"}' \
     http://localhost:7070/api/user/changePassword
# -> 401 Unauthorized (isCurrentUser -> false)

# Admin resets another user
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{"loginName":"jdoe","newPassword":"Welcome!234"}' \
     http://localhost:7070/api/admin/resetPassword
# -> 200 (empty body)  -- but see §8.1: role check is stubbed out

# Log out
curl -i -b cookies.txt -X POST http://localhost:7070/api/auth/logout
# -> 200

# Bad credentials
curl -i -H 'Content-Type: application/json' \
     -d '{"userName":"admin","password":"wrong"}' \
     http://localhost:7070/api/auth/login
# -> 401 { "errorCode":"USER001","errorMessage":"Invalid Credientials" }
```

---

## 8. Known caveats / open items

1. **`isAdminUser()` always returns `true`.** The admin-reset endpoint
   has a TODO in code: *"// TODO add role-check here"*. Any
   authenticated user can reset another user's password. High-priority
   security gap — needs `@PreAuthorize` or an ACL group check.
2. **Typo `"Credientials"`** in the invalid-password message. Clients
   that match on this string will break when the typo is corrected;
   match on the error code (`USER001`) instead.
3. **Same error code for two distinct failures** on login (bad
   password vs deactivated user). Consider `USER002` for deactivated.
4. **`accessToken` field on `LoginResponse`** is never populated. Drop
   it or wire up a real token (stateless API gateway use case).
5. **MD5 password hashing** — `PasswordService.hashPasswordWithKey`
   uses `DigestUtils.md5DigestAsHex`. MD5 is broken for password
   storage; migrate to bcrypt/argon2 when touching this surface.
6. **CSRF is disabled globally.** With session-cookie auth + CSRF
   disabled, the login and password-change endpoints are vulnerable to
   CSRF from a malicious page. nginx does not add CSRF; consider
   enabling Spring Security CSRF with the cookie strategy.
7. **Dual `@GetMapping @PostMapping` on `logout`** works in practice
   but is unusual; GET-based logout is a known CSRF anti-pattern
   (linking a logout URL from an attacker page logs the user out).
   Restrict to POST when CSRF is enabled.
8. **`UserEntity.password` field is persisted into the column named
   `salt`.** The column is semantically the hash, not the salt — the
   salt is in the separate `random` column. A rename alignment
   (`UserEntity.salt` → stored in `salt`, real hash field) would be
   clearer. See `PasswordController.md` for the full formula.
9. **`case-insensitive` comparison in `isCurrentUser`** — relies on
   `equalsIgnoreCase`. `xpm_user.login_name` has a `UNIQUE` constraint
   but is case-sensitive at the DB level; two users `admin` and
   `Admin` cannot both exist, so the ignoreCase is safe but loose.
10. **Divergence from `mongo-service/service/dms-admin`** — the Mongo
    variant has the same controller signature but backs onto a
    Mongo-repo implementation of `UserPasswordRepository`. Message
    strings and status codes should remain identical between the two
    to keep a shared frontend client.
