# PasswordController — Specification

Standalone password-reset endpoint that accepts a plain JSON body
(`loginName` + `password`) and overwrites the stored hash unconditionally
— no "old password" check, no role check. Functionally overlaps with
`AuthenticationController.ResetPassword` but uses project-local
`PasswordService` and the project-local `ResetChangePassword` model
instead of the palmyralabs `palmyra-ext-usermgmt` primitives.

**Module**: `service/dms-admin` (legacy JPA variant)
**Controller**: `com.palmyralabs.dms.admin.controller.PasswordController`
**Service**:    `com.palmyralabs.dms.admin.service.PasswordService`

---

## 1. Routing

```java
@Controller
@RequestMapping
public class PasswordController { ... }
```

Empty class-level mapping — method paths are absolute.

| Method          | External path            | HTTP verb |
| --------------- | ------------------------ | --------- |
| `resetPassword` | `/api/resetPassword`     | `POST`    |

Note: the path does NOT start with `/palmyra/...` — no prefix applies
because the class-level `@RequestMapping` is empty. It is served
directly under the Jetty servlet context `/api`.

Security (`service/dms-base/src/main/java/com/palmyralabs/dms/base/config/SecurityConfig.java`):
`/resetPassword` is NOT in the `permitAll()` whitelist
(`/auth/login`, `/palmyra/public/**`), so it falls under
`anyRequest().authenticated()` — a valid session cookie is required. That
gate is the only access control; there is no role/ACL check at the
controller or service layer.

---

## 2. Endpoints

### 2.1 `POST /api/resetPassword`

Resets the target user's password without verifying the current value.

**Request body** — `com.palmyralabs.dms.admin.model.ResetChangePassword`:

```java
class ResetChangePassword {
    String loginName;
    String password;
    String currentPassoword;   // sic — typo; never used
}
```

```json
{
  "loginName": "jdoe",
  "password":  "NewPass!23"
}
```

* `loginName` — the user whose password is being changed.
* `password` — the new raw password.
* `currentPassoword` — present on the DTO but never read. The name is
  misspelled ("Passoword"); presumably intended to hold the old
  password, but the service skips that check entirely. See §8.

**Response body** — `com.palmyralabs.palmyra.ext.usermgmt.model.LoginName`
(external DTO: two-arg constructor `(loginName, message)`):

```json
{
  "loginName": "jdoe",
  "message":   "Password Changed Successfully."
}
```

(The exact field name for the message portion depends on the
palmyralabs `LoginName` DTO definition — likely a second string field.)

**Return codes**:

| `passwordService.resetPassword(...)` return                   | HTTP | Body                            |
| ------------------------------------------------------------- | ---- | ------------------------------- |
| `"Password Changed Successfully."`                            | 200  | `LoginName(loginName, resultStr)` |
| anything else (e.g. `"Password Must contain at least 8 characters"`) | 400  | `LoginName(loginName, resultStr)` |

The controller matches on `equals("Password Changed Successfully.")`
— an exact, case-sensitive, whitespace-sensitive string compare. Any
drift in the success message produces a 400.

---

## 3. Validation / error responses

### 3.1 Password policy (in `PasswordService.validatePassword`)

Regex: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$`

The service returns a multi-line error message when the candidate
fails one or more of:

| Check                                    | Message appended                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `length < 8`                             | `Must contain at least 8 characters`                                    |
| no lowercase                             | `Must contain at least one lowercase letter`                            |
| no uppercase                             | `Must contain at least one uppercase letter`                            |
| no digit                                 | `Must contain at least one digit`                                       |
| no `@$!%*?&` special                     | `Must contain at least one special character (@$!%*?&)`                 |
| any character outside `[A-Za-z\d@$!%*?&]`| `contains invalid characters. Only use letters, digits, and the specified special characters (@$!%*?&)` |

Messages are joined by `\n` and stripped of trailing whitespace. The
controller then wraps them into `"Password " + validate` and returns
400.

### 3.2 User not found

If `userRepository.findUserByLoginName(loginName)` returns empty AND
the password validated, `resetPassword` silently returns the original
validation string (`"Password is valid."`) **without saving anything**.
The controller's success-check fails (string mismatch), so the caller
receives 400 with body `{ "loginName": "…", "message": "Password is valid." }`.

See §8.2 — this is a bug.

### 3.3 Global handler

`GlobalExceptionHandler` mappings apply if anything throws
(`DateTimeException` → 400, etc.), but this controller does not throw
typed exceptions.

---

## 4. Service contract

`com.palmyralabs.dms.admin.service.PasswordService` is a plain
`@Service` with a single `UserRepository` dependency (field-injected
via constructor `@Autowired`).

```java
String  resetPassword(ResetChangePassword password);
// internal helpers:
private static String validatePassword(String password);    // regex + per-check messages
private String        hashPasswordWithKey(String password, String key);  // MD5((key || password))
public static String  generateRandomString();               // 128 chars of printable ASCII (32..125)

// unused by this controller:
LoginName verifyPassword(String loginName, String password);
```

Call graph of `resetPassword`:

1. `generateRandomString()` — 128 printable-ASCII characters.
2. `hashPasswordWithKey(raw, random)` — MD5 of `random || raw`.
3. `validatePassword(raw)` — if not `"Password is valid."`, return
   `"Password " + that_message` (400 path).
4. `userRepository.findUserByLoginName(loginName)` — if present:
   a. `userEntity.setPassword(hashedPassword)` — persisted into column
      `salt`.
   b. `userEntity.setRandom(random)` — persisted into column `random`.
   c. `userRepository.save(userEntity)`.
   d. Return `"Password Changed Successfully."`.
5. Fallthrough (user not found, still valid): return `"Password Password is valid."`
   — note the double "Password " prefix bug (§8.3).

---

## 5. Data model

### 5.1 Entity — `UserEntity`

File:
`service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/UserEntity.java`.
Table `xpm_user`. Fields relevant here:

| Java field   | Column     | Role                                  |
| ------------ | ---------- | ------------------------------------- |
| `loginName`  | `login_name` | Lookup key.                         |
| `random`     | `random`   | 128-char per-user salt (overwritten). |
| `password`   | `salt`     | MD5 hash (overwritten).               |

Column/field name mismatch note: Java field `password` is mapped to
column `salt` and Java field `random` to column `random`. That is how
palmyralabs `UserPasswordModel` aligns (see `UserPasswordRepoImpl` in
`service/dms-admin/src/main/java/com/palmyralabs/dms/admin/dbpwd/`),
but reading the code without knowing this is confusing.

### 5.2 DTOs

#### `ResetChangePassword` (request)

File:
`service/dms-admin/src/main/java/com/palmyralabs/dms/admin/model/ResetChangePassword.java`.

```java
@Getter @Setter
class ResetChangePassword {
    String loginName;
    String password;
    String currentPassoword;  // unused
}
```

#### `LoginName` (response)

From `com.palmyralabs.palmyra.ext.usermgmt.model.LoginName` (external
palmyralabs). Constructed with `new LoginName(loginName, message)`.
Serialized to JSON by Jackson via its public getters.

### 5.3 Hash formula

```
random = 128 random chars in [32, 125]    (printable ASCII including whitespace)
hash   = md5_hex( random || plaintext )   (UTF-8 bytes)
persist:
  xpm_user.random = random
  xpm_user.salt   = hash
```

The raw password is thrown away; only the combined hash is kept. See
§8.4 for why this is insufficient.

---

## 6. Dependencies / side-effects

### 6.1 DB

* Read `xpm_user` by `login_name`.
* Write `xpm_user.salt` and `xpm_user.random` via
  `UserRepository.save(entity)` (saves the full row — `@EntityListeners`
  updates `last_upd_by` / `last_upd_on`).

### 6.2 Security

* Requires an authenticated session (inherited from
  `SecurityConfig.anyRequest().authenticated()`).
* No role/ACL check — any authenticated user can reset any other
  user's password (including admin's). See §8.

### 6.3 Async / S3 / filesystem

None.

---

## 7. Example requests

```bash
# Happy path
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{"loginName":"jdoe","password":"NewPass!23"}' \
     http://localhost:7070/api/resetPassword
# -> 200
#    { "loginName":"jdoe", "message":"Password Changed Successfully." }

# Weak password (missing digit and special char)
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{"loginName":"jdoe","password":"weakpass"}' \
     http://localhost:7070/api/resetPassword
# -> 400
#    { "loginName":"jdoe",
#      "message":"Password Must contain at least one uppercase letter\nMust contain at least one digit\nMust contain at least one special character (@$!%*?&)" }

# Valid password, unknown user (silent failure)
curl -i -b cookies.txt \
     -H 'Content-Type: application/json' \
     -d '{"loginName":"ghost","password":"StrongPass!23"}' \
     http://localhost:7070/api/resetPassword
# -> 400
#    { "loginName":"ghost", "message":"Password Password is valid." }
#    -- no DB write occurred; user-not-found not surfaced

# No session
curl -i -H 'Content-Type: application/json' \
     -d '{"loginName":"jdoe","password":"NewPass!23"}' \
     http://localhost:7070/api/resetPassword
# -> 401 (SecurityConfig gate)
```

---

## 8. Known caveats / open items

1. **No role check.** Any authenticated user can reset any other
   user's password. `AuthenticationController.ResetPassword` has the
   same issue but at least gestures at it with a TODO. This endpoint
   doesn't even try.
2. **User-not-found is indistinguishable from "password is valid but
   we did nothing."** Service returns `"Password is valid."` and the
   controller returns `400 {message: "Password Password is valid."}`.
   Fix: return a distinct message (e.g. `"User not found."`) or throw
   `DataNotFoundException`.
3. **Double "Password " prefix bug.** On the user-not-found path, the
   response message is `"Password Password is valid."` — the controller
   prepends `"Password "` and the service already returned `"Password
   is valid."`. Cosmetic but visible.
4. **MD5 for password hashing.** `DigestUtils.md5DigestAsHex` is
   broken; offline brute force is trivial. Migrate to bcrypt/argon2
   in a coordinated schema change with `PasswordService` and
   `UserPasswordRepoImpl`.
5. **`currentPassoword` field (sic) is never validated.** Either
   require it and compare against the stored hash (promote this to a
   true "change password" flow) or remove the field.
6. **Hardcoded success-string compare.** Controller matches on the
   exact English string `"Password Changed Successfully."`. Refactor
   into an enum/code return and map codes to HTTP status.
7. **Random salt includes whitespace characters.** `generateRandomString`
   draws uniformly from ASCII 32..125 — that includes space and
   printable punctuation. Storing that in a `varchar(128)` column works
   but makes diagnostic dumps awkward. Use a hex/base64 salt.
8. **Overlap with `AuthenticationController.ResetPassword`.** Two
   different endpoints (`POST /admin/resetPassword` vs
   `POST /resetPassword`) do nearly the same thing with different
   validation. Consolidate into one, decide if old password is
   required, and delete the loser.
9. **Duplicate `PasswordService` implementation.** Project-local
   `com.palmyralabs.dms.admin.service.PasswordService` (this file)
   coexists with the palmyralabs `com.palmyralabs.palmyra.ext.usermgmt.service.PasswordMgmtService`
   used by `AuthenticationController`. The hashing contracts appear
   aligned (both MD5 random+password via
   `UserPasswordRepoImpl`), but maintaining two paths is a trap —
   behaviour can drift silently.
10. **Divergence from `mongo-service/service/dms-admin`** — the Mongo
    variant has the same controller file; the backend only differs in
    the `UserRepository` implementation (Mongo vs JPA). The hashing
    formula and the password regex are shared, so any update here
    should land in both.
