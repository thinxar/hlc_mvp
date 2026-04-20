# AnnotationController — Specification

Empty stub controller. Declares `@RestController` but defines no
methods, no class-level `@RequestMapping`, no fields, no injected
collaborators. Produces no endpoints.

**Module**: `service/dms-policy` (legacy JPA variant)
**Class**:  `com.palmyralabs.dms.controller.AnnotationController`
**File**:   `service/dms-policy/src/main/java/com/palmyralabs/dms/controller/AnnotationController.java`

> Grouping note: kept in its own `annotation/` folder (as the task
> brief anticipated) because the intent of the file is clearly
> "annotations on policy files" — a distinct feature surface from
> upload/download (`file/`) and stamp placement (`stamp/`). If/when
> this stub is fleshed out, the feature folder name is already
> correct.

---

## 1. Routing

Source, verbatim:

```java
package com.palmyralabs.dms.controller;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnnotationController {
    
}
```

* No class-level `@RequestMapping`.
* No method-level mapping.
* Result: Spring registers the bean but routes nothing. Any HTTP
  request that hypothetically looks like an "annotation" call falls
  through to the default 404.

The package prefix `com.palmyralabs.dms.controller` falls under
`AppMain`'s component scan base `com.palmyralabs.dms` (see
`service/dms-main/src/main/java/com/palmyralabs/dms/AppMain.java`), so
the bean IS registered — it just has no mappings to dispatch to.

---

## 2. Endpoints

None. The controller exposes zero routes.

For completeness: if this controller were to host annotation CRUD,
based on the sibling `DmsPolicyFileHandler` convention (see
`service/dms-policy/src/main/java/com/palmyralabs/dms/handler/DmsPolicyFileHandler.java`)
and the existence of `FileAnnotationEntity`
(`service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/FileAnnotationEntity.java`),
the natural mapping would be:

```
${palmyra.servlet.prefix-path:palmyra}/policy/{policyId}/file/{fileId}/annotation
```

But that is **speculation**; the controller as written does not
implement it.

---

## 3. Validation / error responses

No surface to validate against. Any request would 404 from the Spring
dispatcher before reaching this bean.

---

## 4. Service contract

None. No injected services, no collaborators.

Note that a paired data-access layer *does* exist elsewhere in the
repo:

* `service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/FileAnnotationEntity.java`
  — entity for a table it maps to as `dms_policy_file` (see §8 for
  the conflict).
* No `FileAnnotationRepository` exists; no handler or service
  references the entity.

So even if a developer wanted to wire this up, the persistence side is
incomplete.

---

## 5. Data model

### 5.1 `FileAnnotationEntity` (orphaned)

File:
`service/dms-jpa/src/main/java/com/palmyralabs/dms/jpa/entity/FileAnnotationEntity.java`.

```java
@Entity
@Table(name = "dms_policy_file")     // <-- SAME table as PolicyFileEntity
public class FileAnnotationEntity implements Auditable {
    Long    id;
    Long    policyId;
    String  fileName;
    Long    fileSize;
    String  fileType;
    Long    docketType;
    String  objectUrl;
    Timestamps timestamps;
}
```

The fields are a 1:1 copy of `PolicyFileEntity` and the `@Table` name
is literally the same — `dms_policy_file`. There is no "annotation"
column. This looks like a boilerplate placeholder pasted in to reserve
the filename. Two entities declared against the same table is a Spring
Data JPA anti-pattern (Hibernate will still start because both mappings
are identical shapes, but any derived query becomes ambiguous).

### 5.2 No DTO, no model, no handler class dedicated to annotations.

Search performed: no `AnnotationModel`, no `FileAnnotationModel`, no
`AnnotationHandler`, no `AnnotationService`, no `AnnotationRepository`
anywhere under `service/`.

---

## 6. Dependencies / side-effects

None — the class has no fields, makes no calls, writes nothing.

---

## 7. Example requests

No endpoints defined, so no valid requests exist. Any URL of the form
`/api/palmyra/.../annotation` or `/api/.../annotation` produces 404
from Spring's default dispatcher.

---

## 8. Known caveats / open items

1. **This controller is a stub.** Delete or implement. Shipping an
   empty `@RestController` bean makes future readers think annotation
   support exists when it doesn't.
2. **`FileAnnotationEntity` maps to the WRONG table.** `@Table(name = "dms_policy_file")`
   collides with `PolicyFileEntity` — either it should be
   `dms_file_annotation` (with its own schema) or the entity should be
   deleted. No DDL for `dms_file_annotation` exists in
   `dbscripts/` today.
3. **No repository for the entity.** Even if the table were correct,
   there's no `FileAnnotationRepository`, so the entity is dead code.
4. **No frontend call path.** `web/src/config/ServiceEndpoint.ts` does
   not reference any `/annotation` path. No component triggers such a
   request.
5. **Divergence from `mongo-service/service/dms-policy`.** The Mongo
   variant ships the same empty file
   (`mongo-service/service/dms-policy/src/main/java/com/palmyralabs/dms/controller/AnnotationController.java`) —
   identical stub. Both codebases carry the dead class.
6. **Possible future work**: the palmyralabs `rt-forms` frontend has
   PDF annotation support baked in via the viewer components
   (`web/src/pages/customViewer`). If annotations become a feature, the
   shape is likely: `POST /policy/{policyId}/file/{fileId}/annotation`
   with `{ page, x, y, w, h, text }` payload, storing to a new
   `dms_file_annotation` table. None of that is implemented.
