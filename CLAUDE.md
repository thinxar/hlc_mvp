# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Multi-module monorepo for an insurance document-management MVP. The top-level folders are independent build units — each has its own toolchain.

- `mongo-service/service/` — **active Spring Boot backend (MongoDB).** Gradle multi-module (`dms-main` is the launchable app; sibling modules `dms-admin`, `dms-base`, `dms-filemgmt`, `dms-jpa`, `dms-masterdata`, `dms-policy`, `dms-s3`, `dms-revival`, `dms-policyBazaar`, `dms-ananda` are libraries). Java 17 source, built in a Gradle 8.13 / JDK 21 Docker image.
- `service/` — **older JPA/Postgres variant of the same backend.** Same module names minus the `dms-revival`/`dms-policyBazaar`/`dms-ananda` packages. Kept for reference; new work goes into `mongo-service/service/`.
- `web/` — React 19 + Vite 7 + TypeScript frontend (Mantine 8, Tailwind 4, palmyralabs `rt-forms` / `palmyra-wire` / `rt-apexchart`). Entry `src/main.tsx` → `src/App.tsx` → routes in `src/routes/AppRoutes.tsx`. Dev server runs on port 5000 and proxies `/api` to `http://192.168.1.101:7070/`.
- `dataloader/`, `hlc_ananda_dataload/`, `hlc_policyBazaar_dataload/`, `hlc_revival_dataload/` — standalone Spring Boot / Gradle CLI apps (each with a `DataLoadMain`) that bulk-load CSV data into the backend's Mongo. Independent `settings.gradle` per folder.
- `claude/` — AI-authored artifacts folder with two distinct purposes:
  - `claude/demo_data_generator/` — synthetic dataset pipeline (Node.js, no package.json). Converts `base_data/branch.csv` into `generated/*.json[l]` fixtures the backend loads. See **Data pipeline** below.
  - `claude/service/<module>/<feature>/` — per-feature specification docs for backend services (e.g. `claude/service/dms_revival/dashboard/RevDashBoardController.md`). Note the underscore in `dms_revival` — the spec tree uses `_` where the Gradle module name uses `-`. Prefer editing an existing spec over creating a new one when updating an already-documented feature.
- `dbscripts/` — PostgreSQL DDL and `alter_*.sql` migrations for the legacy `service/` variant. Not used by `mongo-service/`.
- `nginx/nginx.conf` — production reverse proxy: serves `web/` build from `/opt/ldm/web`, proxies `/api/*` to upstream `127.0.0.1:8080`.

## Build & run

### Backend (`mongo-service/service/`)

```bash
# from mongo-service/service/
./gradlew :dms-main:build              # full build
./gradlew :dms-main:installDist        # assembles runnable dist into ../dist
./gradlew :dms-policy:test             # run tests for one module
./gradlew test                         # all tests (JUnit 5 via useJUnitPlatform)

# Docker image (multi-stage: Gradle 8.13-jdk21 → openjdk:21-jdk-slim)
./dockerbuild.sh                       # docker build -t hlcservice .
./rundocker.sh                         # docker run --name hlc_service hlcservice
```

Entry point: `com.palmyralabs.dms.AppMain` in `dms-main`. Runtime config: `dms-main/src/main/resources/application.yaml` (Mongo host/port/creds, Jetty on port 7070, context path `/api`, S3 settings, file-store base folder). **Do not commit real credentials** — the yaml currently holds example values; check git status before committing edits here.

### Frontend (`web/`)

```bash
# from web/
npm install
npm run dev          # vite, port 5000, auto-opens browser, proxies /api to 192.168.1.101:7070
npm run build        # tsc -b && vite build
npm run lint         # eslint
npm run preview      # preview production build
```

TS path aliases (see `tsconfig.app.json`): `config/*`, `templates/*`, `wire/*`, `components/*`, `utils/*`, `public/*` — all rooted at `web/`. Import with these aliases rather than long relative paths.

### Data pipeline (`claude/demo_data_generator/`)

Generates demo fixtures from the single input `base_data/branch.csv`. Bootstrap: create `claude/demo_data_generator/base_data/` and drop `branch.csv` there before the first run.

```bash
# from claude/demo_data_generator/
node scripts/run_pipeline.js                         # full pipeline, system date
node scripts/run_pipeline.js 2026-04-19              # pin GEN_TODAY and REPORT_TODAY
GEN_TODAY=2026-04-19 REPORT_TODAY=2026-04-19 node scripts/run_pipeline.js
SKIP_STAGE_0=1 node scripts/run_pipeline.js          # reuse generated/branch.csv
SKIP_STAGE_1=1 node scripts/run_pipeline.js          # skip reference extractions
SKIP_STAGE_2=1 node scripts/run_pipeline.js          # reuse generated/all_cases.jsonl
```

Stages (see `specs/pipeline/run_order_spec.txt` inside the pipeline root for the authoritative spec): **Stage 0** cleanses master CSV → `generated/branch.csv`; **Stage 1** reference extractions (`branches.json`, `zone_divisions.json`) — parallel-safe; **Stage 2** `generate_all_cases.js` builds the master `all_cases.jsonl` (dominates runtime, deterministic per fixed seed + `GEN_TODAY`); **Stage 3** four independent aggregators consume `all_cases.jsonl`. `GEN_TODAY` and `REPORT_TODAY` should be set to the same date — misaligned values produce reports whose `REF_DATE` doesn't match the dataset clamp. Every script overwrites its single output; no append, no cache — for a clean build delete `generated/` and rerun.

The generated JSON/JSONL fixtures are consumed by `mongo-service/service/dms-revival/src/main/java/com/palmyralabs/dms/revival/service/RevDataload/MongoDataLoader.java`, which upserts them into MongoDB. After the April 2026 Date migration, the loader normalizes ISO-date string fields (`month`, `cal_date`, `cal_week`, `cal_month`) to BSON `Date` at UTC midnight during ingest — see `FileSpec.dateFields` and `normalizeDateFields`. ⚠️ `MongoDataLoader.CANDIDATE_DATA_ROOTS` still points at the old paths (`E:/hlc_mvp/claude/generated`, `../../claude/generated`) — update to `.../claude/demo_data_generator/generated` or pass `-DDATA_DIR=...` explicitly.

## Architecture notes

### Backend module graph

`dms-main` pulls in every feature module (`dms-jpa`, `dms-admin`, `dms-policy`, `dms-filemgmt`, `dms-masterdata`, `dms-revival`, `dms-policyBazaar`, `dms-ananda`). Feature modules typically follow the `controller/ service/ repository/ entity/ model/ modelMapper/` split (see `dms-revival/src/main/java/com/palmyralabs/dms/revival/`). Component scanning in `AppMain` covers `com.palmyralabs.dms`, `com.palmyralabs.palmyra.enhancer`, `com.palmyralabs.palmyra.filemgmt`, `com.palmyralabs.palmyra.s3` — new packages outside these won't be picked up.

Framework stack: Spring Boot 3.3.4 on **Jetty** (Tomcat excluded globally via `configurations.all` in `build.gradle`), Spring Data MongoDB 3.3.5, Spring Security (method-level), Lombok, Log4j2→SLF4J bridge, palmyralabs internal libs (`palmyra.spring`, `palmyra.extn.pwdmgmt`, `palmyra.extn.aclmgmt`) from `repo.palmyralabs.com`. `@EnableMongoAuditing`, `@EnableMethodSecurity`, `@EnableAsync` are active.

The `service/` (non-mongo) tree mirrors the structure but uses JPA/Postgres and lacks `dms-revival`/`dms-policyBazaar`/`dms-ananda`. Treat it as legacy unless the user directs otherwise.

### Frontend architecture

- **Data access** goes through palmyralabs `palmyra-wire`. `src/wire/StoreFactory.ts` builds `PalmyraStoreFactory` instances against `ServiceEndpoint.baseUrl + "/api/palmyra"` (app store) or `/api` (plain store). Components pull stores via `useFormstore` / `useGridstore`. Error handler maps 401 → session-expired page, 403 → ACL toast, 500 → server-error toast, 502 → "server down" SweetAlert.
- **All REST paths** live in `src/config/ServiceEndpoint.ts` under namespaces: `auth`, `policy`, `customView.rev` (revival), `customView.and` (ananda), `customView.pbv` (policy bazaar), `lookup`, `aclmgmt`, `userManagement`. Add new endpoints here, do not scatter URL literals.
- **Routes** in `src/routes/AppRoutes.tsx`: `appRoutes` for the main layout (home, policy result, custom viewer, revival dashboards) and `iframeRoutes` for embedded iframe variants. Top-level layouts `MainLayout` vs `IFrameLayout` are selected in `App.tsx`. Theme (`isDarkMode`) flows from `wire/ThemeProvider` and toggles a `theme` body attribute plus the Tailwind `dark` class.
- **Pages** under `src/pages/` are grouped by feature (`customViewer`, `dashboard/{doDashboard,srDashboard}`, `endorsements`, `generalSection`, `home`, `landingPage`, `login`, `policyResult`, `policySearch`). Shared building blocks live in `src/common/` (layout, pages, component) and `src/components/` (Topbar, fileUpload, viewer).

### Deployment shape (per `nginx/nginx.conf`)

Nginx serves the built `web/` bundle from `/opt/ldm/web` with 1h expiry and SPA fallback (`try_files $uri $uri/ /index.html`). `/api/*` is reverse-proxied to upstream `lic_proxy` at `127.0.0.1:8080` with a 24 MB body limit and 300s read timeout. Gzip is on for text/JS/JSON ≥1 KB. Note: the backend listens on `7070` in `application.yaml` but nginx upstream is `8080` — production deployments change the backend port or front it with another proxy.
