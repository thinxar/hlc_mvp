# AclMenuController — Specification

Side-menu (ACL-filtered) endpoints. Two `GET`s that render the currently
authenticated user's top-level menu and its recursive child tree, sourced
entirely from two hand-written PostgreSQL native queries.

**Module**: `service/dms-admin` (legacy JPA variant)
**Controller**: `com.palmyralabs.dms.admin.controller.AclMenuController`
**Query bean**: `com.palmyralabs.dms.jpa.query.AclMenuQuery` (plain `new`, not Spring-managed)
**Principal resolver**: `com.zitlab.palmyra.store.base.security.AuthProvider` (palmyralabs lib)

---

## 1. Routing

Class-level mapping:

```java
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}")
```

No sub-path on the class — endpoint paths are fully declared on each
`@GetMapping`. Combined with:

* Jetty servlet context — `/api` (`server.servlet.context-path` in
  `service/dms-main/src/main/resources/application.yaml`)
* Default prefix property — `palmyra`

the external URLs become:

| Method                | External path                                         |
| --------------------- | ----------------------------------------------------- |
| `getSideMenuParent`   | `GET /api/palmyra/acl/menu/parent`                    |
| `getSideMenuChild`    | `GET /api/palmyra/acl/menu/parent/{parentId}/child`   |

Both paths fall under `/api/**`, which means they pass through the
nginx reverse proxy (`nginx/nginx.conf`) to the Jetty upstream.

Security: both endpoints require an authenticated session (see
`service/dms-base/src/main/java/com/palmyralabs/dms/base/config/SecurityConfig.java`
— `anyRequest().authenticated()`; only `/auth/login` and
`/palmyra/public/**` are public). No method-level `@PreAuthorize`.

---

## 2. Endpoints

Both methods return `void`. Response rendering goes through
`BaseController.asJson(NativeQueryResponse)`, which delegates to
palmyralabs `NativeQueryExportService` — that service streams the query
result to the HTTP response as JSON directly. Controller does not build
a `ResponseEntity`.

### 2.1 Top-level menu for the logged-in user

```
GET /api/palmyra/acl/menu/parent
```

| Param | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| *(none)* | — | — | Principal resolved server-side via `authProvider.getUser()`. |

**Native SQL** (`AclMenuQuery.ACL_MENU_PARENT_QUERY`):

```sql
SELECT menu.id, menu.name, menu.code, menu.action, menu.display_order
FROM   xpm_menu     menu
JOIN   xpm_acl_menu xam ON xam.menu_id  = menu.id
JOIN   xpm_acl_user xau ON xau.group_id = xam.group_id
                        AND xau.active = 1
                        AND menu.active = 1
JOIN   xpm_group    xg  ON xg.id = xam.group_id
                        AND xg.active = 1
                        AND menu.active = 1
JOIN   xpm_user     xu  ON xu.id = xau.user_id
WHERE  xu.login_name = ?
  AND  xam.mask > 0
  AND  menu.parent IS NULL
GROUP BY menu.id
```

Parameter 1 is the login name from the current security context.

**Response shape** — JSON array of rows as `[{column: value, ...}, …]`
(streamed by palmyralabs `NativeQueryExportService`). Example:

```json
[
  { "id": 3,  "name": "Policy",     "code": "POLICY",    "action": "summary", "display_order": 1 },
  { "id": 7,  "name": "Dashboard",  "code": "DASHBOARD", "action": "summary", "display_order": 2 },
  { "id": 12, "name": "Admin",      "code": "ADMIN",     "action": "summary", "display_order": 3 }
]
```

Only menus with `active = 1`, belonging to a group the user is in
(`xpm_acl_user.active = 1`, `xpm_group.active = 1`) and with
`xpm_acl_menu.mask > 0` show up. `menu.parent IS NULL` restricts to
top-level entries.

### 2.2 Recursive children of a parent menu

```
GET /api/palmyra/acl/menu/parent/{parentId}/child
```

| Param      | Type    | Required | Notes                                     |
| ---------- | ------- | -------- | ----------------------------------------- |
| `parentId` | Integer | yes      | Path variable — the `xpm_menu.id` the user wants to expand. |

Also uses `authProvider.getUser()` to filter down to menus the user has
visibility on.

**Native SQL** (`AclMenuQuery.ACL_MENU_CHILD_QUERY`, recursive CTE):

```sql
WITH RECURSIVE sidemenu AS (
  SELECT menu.id, menu.name, menu.code, menu.action, menu.parent,
         menu.display_order, menu.icon
  FROM   xpm_menu     menu
  JOIN   xpm_acl_menu xam ON xam.menu_id  = menu.id
  JOIN   xpm_acl_user xau ON xau.group_id = xam.group_id
                         AND xau.active = 1
                         AND menu.active = 1
  JOIN   xpm_user     xu  ON xu.id = xau.user_id
  WHERE  xu.login_name = ?
    AND  xam.mask > 0
    AND  menu.parent = ?
  UNION ALL
  SELECT m.id, m.name, m.code, m.action, m.parent,
         m.display_order, m.icon
  FROM   xpm_menu m
  JOIN   sidemenu sm ON m.parent = sm.id
)
SELECT sm.id, sm.name, sm.code, sm.action, sm.parent,
       string_agg(child.id::text, ',' ORDER BY child.display_order) AS children,
       sm.icon
FROM   sidemenu sm
LEFT JOIN sidemenu child ON child.parent = sm.id
GROUP BY sm.id, sm.name, sm.code, sm.action, sm.parent, sm.display_order, sm.icon
ORDER BY sm.display_order
```

Parameters — `?1` login name, `?2` parent id.

**Note**: the recursive leg (`UNION ALL`) does NOT re-apply the
`xpm_acl_menu` join — once the CTE enters a subtree, every descendant
is returned regardless of ACL mask. This is a known divergence from the
parent-level query; it effectively means ACL is enforced at the
"top-level" visibility, not per node.

**Response shape**:

```json
[
  {
    "id": 42, "name": "Case Search", "code": "CASE_SEARCH",
    "action": "summary", "parent": 3,
    "children": "55,56,57",
    "icon": "search"
  },
  {
    "id": 55, "name": "By Branch",   "code": "CASE_BY_BRANCH",
    "action": "summary", "parent": 42,
    "children": null,
    "icon": null
  }
]
```

`children` is a comma-separated string (Postgres `string_agg`) of child
ids ordered by `display_order`. `null` for leaf nodes.

---

## 3. Validation / error responses

No request-body validation. The only typed input is `parentId` (path
variable). Spring parses it as `Integer` — a non-numeric segment
(`/acl/menu/parent/abc/child`) produces a Spring
`MethodArgumentTypeMismatchException`.

| Condition                                                 | HTTP |
| --------------------------------------------------------- | ---- |
| Unauthenticated request                                   | 401 — `HttpStatusEntryPoint` in `SecurityConfig` |
| Non-integer `parentId`                                    | 400 — default Spring mismatch handler (no entry in `GlobalExceptionHandler` for it) |
| Valid request but user has no menus / `parentId` unknown  | 200 with `[]` — empty array, not an error |
| SQL/JDBC failure                                          | 500 — falls through `GlobalExceptionHandler` (no `@ExceptionHandler` for `DataAccessException`) |

`GlobalExceptionHandler`
(`service/dms-base/src/main/java/com/palmyralabs/dms/base/handler/GlobalExceptionHandler.java`)
maps a common set of palmyralabs exceptions (`DataNotFoundException`,
`UnAuthorizedException`, `InvaidInputException`, …) — none of them are
thrown by this controller under normal operation.

---

## 4. Service / collaborator contract

```java
// self-new'd, not @Autowired:
private final AclMenuQuery aclMenuQuery = new AclMenuQuery();

// Spring-injected (constructor — Lombok @RequiredArgsConstructor):
private final AuthProvider authProvider;

// calls:
NativeQueryResponse AclMenuQuery.getParentMenu(String loginName);
NativeQueryResponse AclMenuQuery.getChildMenu(String loginName, Integer parentId);
String              AuthProvider.getUser();
void                BaseController.asJson(NativeQueryResponse);
```

`AclMenuQuery` holds only `static final` SQL strings — it is stateless,
so the `new` instantiation in the controller is harmless but bypasses
Spring. The class has no Spring stereotype.

`AuthProvider` is a palmyralabs interface (`palmyra-store-base`). In
this codebase it's satisfied by
`service/dms-admin/src/main/java/com/palmyralabs/dms/admin/security/DmsSpringUserProvider.java`
— reads `SecurityContextHolder.getContext().getAuthentication().getName()`.

Note: `DmsSpringUserProvider` implements the project-local
`com.palmyralabs.dms.base.config.UserProvider`, not the palmyralabs
`AuthProvider`. The `AuthProvider` bean consumed by this controller
lives in a palmyralabs dependency (likely a
`@Component` inside the `palmyra-store` jar) — not in this repo.

---

## 5. Data model

### 5.1 Tables read

Schema (see `dbscripts/001.create.sql`, `dbscripts/002_acl_table.sql`,
`dbscripts/004_menu_data.sql`). No JPA entity is used on this path —
only raw native SQL via `NativeQueryResponse`.

| Table              | Role                                                                         |
| ------------------ | ---------------------------------------------------------------------------- |
| `xpm_menu`         | Menu tree. Columns read: `id, parent, name, code, action, display_order, icon, active`. |
| `xpm_acl_menu`     | Group → menu permission grant. Read: `menu_id, group_id, mask`. `mask > 0` gates visibility. |
| `xpm_acl_user`     | User → group membership. Read: `user_id, group_id, active`. `active = 1` required. |
| `xpm_group`        | Group master. Read: `id, active`. `active = 1` required. Only joined on parent query. |
| `xpm_user`         | User master. Read: `id, login_name`.                                         |

### 5.2 Related JPA entities (present in repo, NOT used on this path)

| Entity                                                                                                          | Table      | Usage |
| --------------------------------------------------------------------------------------------------------------- | ---------- | ----- |
| `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/MenuEntity.java`                                  | `xpm_menu` | Only referenced by `UserEntity.displayPage` and `AboutUserHandler`. |
| `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/UserEntity.java`                                  | `xpm_user` | Used by `UserService`, `PasswordService`. |

The ACL query path is deliberately native SQL — JPA would need
explicit mappings for a recursive CTE.

### 5.3 Response row shape

There is no DTO class. Each result row is the raw column set the SQL
emits; `NativeQueryExportService` uses reflection-free column names
verbatim as JSON keys. The frontend (`web/src/config/ServiceEndpoint.ts
→ aclmgmt.*`) consumes these objects directly.

---

## 6. Dependencies / side-effects

### 6.1 DB
Read-only against `xpm_menu`, `xpm_acl_menu`, `xpm_acl_user`,
`xpm_group`, `xpm_user`. No writes. Uses the default Postgres connection
pool configured via `spring.datasource.*` in
`service/dms-main/src/main/resources/application.yaml`.

### 6.2 Session / security
* Reads current login name from `SecurityContextHolder` through
  `AuthProvider`.
* Session-based auth (`HttpSessionSecurityContextRepository` in
  `service/dms-base/src/main/java/com/palmyralabs/dms/base/config/SecurityConfigRepositoryConfig.java`).
* 401 is returned by the security filter chain, never by this
  controller.

### 6.3 No S3, no async, no filesystem
Pure read path.

---

## 7. Example requests

```bash
# Top-level menu for user 'admin' (session cookie assumed)
curl -b 'JSESSIONID=…' \
     http://localhost:7070/api/palmyra/acl/menu/parent

# Children of parent id 3
curl -b 'JSESSIONID=…' \
     http://localhost:7070/api/palmyra/acl/menu/parent/3/child

# Error — no session
curl http://localhost:7070/api/palmyra/acl/menu/parent
# -> 401 Unauthorized (empty body; HttpStatusEntryPoint)
```

Port 7070 is the backend's direct Jetty port (`server.port` in
`application.yaml`); production deployments front this with nginx on
standard ports per `nginx/nginx.conf`.

---

## 8. Known caveats / open items

1. **Recursive CTE skips the ACL join on descendants.** Once the
   anchor row is allowed (mask > 0 + user in group), every child in the
   subtree is returned unfiltered. If granular per-node ACL ever
   matters, re-apply the join in the recursive leg.
2. **`AclMenuQuery` is instantiated with `new`**, not a Spring bean —
   cannot be mocked or overridden via DI. Fine because the class holds
   only static SQL, but inconsistent with every other collaborator in
   the codebase.
3. **`children` is a comma-separated string**, not a JSON array. The
   frontend has to split on `,`. Cleaner to emit as an array, but the
   SQL `string_agg` is the simplest way to collapse the LEFT JOIN rows.
4. **`MenuEntity`** (JPA) is underused — could serve this path via
   `JpaRepository` + a projection if the recursive CTE were replaced by
   two separate queries or a stored procedure. Not recommended; the CTE
   is efficient and well-indexed.
5. **`getSideMenuParent` does not take `parentId`** — it relies on
   `menu.parent IS NULL`. If the schema ever introduces multiple root
   nodes under a synthetic "site" parent, this query has to change.
6. **No caching.** Every request re-runs the join. For a stable ACL
   tree this is wasteful; consider `@Cacheable` keyed on login name at
   the service layer if load becomes an issue.
7. **Divergence from `mongo-service/service/`** — the Mongo variant
   does not ship an `AclMenuController` under `dms-admin`. Menu/ACL
   surface on the Mongo side is served by palmyralabs library code
   (`palmyra.extn.aclmgmt`). The legacy SQL query here is the only
   place this menu tree is materialized in code we own.
