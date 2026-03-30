# AGENTS.md - DoAn Workspace Guide

Purpose: operating guide for coding agents working in `D:\DoAn`.
Scope: root orchestration plus `panthora_be/`, `pathora/frontend/`, and `tour-guide-mobile/`.

## 1) Instruction Precedence
- User instructions always win.
- Then follow the nearest `AGENTS.md` for files being edited.
- Use this root file for cross-repo work or root-level tasks.
- Known deeper guides: `panthora_be/AGENTS.md`, `pathora/AGENTS.md`, `pathora/frontend/AGENTS.md`.
- Keep edits scoped; avoid unrelated refactors.

## 2) Workspace Snapshot
- `D:\DoAn` is an orchestration directory, not a git repository.
- `panthora_be/`: ASP.NET Core backend (`net10.0`, Clean Architecture + CQRS).
- `pathora/frontend/`: Next.js 16 + React 19 web app with Vitest.
- `tour-guide-mobile/`: Expo React Native app with TypeScript strict mode.
- Default local ports: API `5182`, frontend `3001`, PostgreSQL `5432`, Redis `6379`, MinIO `9000/9001`.

## 3) Cursor and Copilot Rules (Mandatory if Present)
Checked on 2026-03-20:
- Cursor rules: `.cursorrules` not found, `.cursor/rules/` not found.
- Copilot files found: `.github/copilot-instructions.md`, `pathora/.github/copilot-instructions.md`.
- Apply the nearest Copilot file for the repo being edited.
- For root orchestration work, consider both Copilot files.
- If Copilot guidance conflicts with package scripts, config, or source, trust repository truth.

Known Copilot drift to correct while coding:
- Frontend dev port is `3001`, not `3000`.
- Frontend does have tests: `npm run test` uses Vitest.
- Backend local non-container API commonly runs on `5182`, even if older docs mention `8080`.

## 4) Build, Lint, and Test Commands
Run from `D:\DoAn` unless a section says otherwise.

### 4.1 Backend (`panthora_be`)
```bash
dotnet restore panthora_be/LocalService.slnx
dotnet build panthora_be/LocalService.slnx
dotnet build panthora_be/LocalService.slnx -c Release
dotnet format panthora_be/LocalService.slnx --verify-no-changes
dotnet test panthora_be/LocalService.slnx
dotnet test panthora_be/tests/Domain.Specs/Domain.Specs.csproj
dotnet run --project panthora_be/src/Api/Api.csproj
dotnet run --project panthora_be/src/Infrastructure.DatabaseMigration/Infrastructure.DatabaseMigration.csproj
```

EF migrations (run from `D:\DoAn\panthora_be`):
```bash
dotnet ef migrations add <MigrationName> --project src/Infrastructure --startup-project src/Api
dotnet ef database update --project src/Infrastructure --startup-project src/Api
```

### 4.2 Backend single-test cookbook (xUnit)
```bash
dotnet test panthora_be/tests/Domain.Specs/Domain.Specs.csproj --list-tests
dotnet test panthora_be/tests/Domain.Specs/Domain.Specs.csproj --filter "FullyQualifiedName~Domain.Specs.Application.Validators.CreateTourCommandValidatorTests"
dotnet test panthora_be/tests/Domain.Specs/Domain.Specs.csproj --filter "FullyQualifiedName=Domain.Specs.Application.Validators.CreateTourCommandValidatorTests.Validate_WhenTourNameExactly500Chars_ShouldPass"
dotnet test panthora_be/tests/Domain.Specs/Domain.Specs.csproj --filter "FullyQualifiedName~CreateTourCommandValidatorTests.Validate_WhenTourNameExactly500Chars_ShouldPass"
```
- Prefer exact `FullyQualifiedName=<Namespace.Class.Method>` when possible.
- If 0 tests run, re-check names with `--list-tests`.
- Add `--no-build` only when binaries are already current.

### 4.3 Frontend (`pathora/frontend`)
```bash
npm ci --prefix pathora/frontend
npm run dev --prefix pathora/frontend
npm run dev:turbopack --prefix pathora/frontend
npm run lint --prefix pathora/frontend
npm run test --prefix pathora/frontend
npm run build --prefix pathora/frontend
npm run start --prefix pathora/frontend
npm run analyze --prefix pathora/frontend
```

### 4.4 Frontend single-test cookbook (Vitest)
```bash
npm run test --prefix pathora/frontend -- src/utils/__tests__/apiResponse.test.ts
npm run test --prefix pathora/frontend -- src/utils/__tests__/apiResponse.test.ts -t "extractItems"
npm run test --prefix pathora/frontend -- -t "middleware"
```
- Pass Vitest arguments only after `--`.
- Prefer file-scoped or `-t` filtered runs before the full suite.

### 4.5 Mobile (`tour-guide-mobile`)
```bash
npm ci --prefix tour-guide-mobile
npm run start --prefix tour-guide-mobile
npm run android --prefix tour-guide-mobile
npm run ios --prefix tour-guide-mobile
npm run web --prefix tour-guide-mobile
npm run check:hardcoded --prefix tour-guide-mobile
npx --prefix tour-guide-mobile tsc --noEmit
```
- No dedicated automated test runner is defined yet.
- Minimum validation is `tsc --noEmit` plus `check:hardcoded` and focused manual checks.

## 5) Code Style Guidelines

### 5.1 General cross-repo rules
- Match existing local patterns before introducing new abstractions.
- Avoid broad formatting-only edits in unrelated files.
- Prefer small cohesive functions and thin entrypoints.
- Add comments only for non-obvious intent or constraints.
- Never commit secrets, tokens, or private keys.

### 5.2 Backend (`panthora_be`, C#/.NET)
- Baseline: `net10.0`, `ImplicitUsings=enable`, `Nullable=enable`, `TreatWarningsAsErrors=true`, `EnforceCodeStyleInBuild=true`.
- Dependency direction: `Domain -> Application -> Infrastructure -> Api`; do not invert it.
- Keep controllers thin; business flow belongs in MediatR handlers/services.
- `using` order: `System`, `Microsoft`, third-party, then project namespaces.
- Use file-scoped namespaces, 4-space indentation, and same-line braces.
- Naming: `PascalCase` for types/members, `camelCase` for locals/params, `_camelCase` for private fields, `I` prefix for interfaces.
- Preserve common suffixes such as `Command`, `Query`, `Validator`, `Request`, `Response`, `Vm`, `Entity`, `Dto`.
- Prefer immutable `record` request/response models where the feature already uses them.
- Respect nullability (`string` vs `string?`) and avoid unnecessary null-forgiving (`!`).
- Keep async end-to-end; do not use `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()`.
- Pass `CancellationToken` through async boundaries when available.
- Expected business failures should return `ErrorOr<T>`.
- Unexpected failures should throw; never swallow exceptions silently.
- Use `throw;` when rethrowing to preserve stack traces.
- Prefer `DateTimeOffset` for UTC timestamps and `Guid.CreateVersion7()` for new IDs.
- Keep EF-specific logic in `Infrastructure`; use `AsNoTracking()` for read-only queries.
- Reuse validation and message constants from `src/Application/Common/Constant/`.

### 5.3 Frontend (`pathora/frontend`, Next.js/TypeScript)
- Formatting: 2-space indentation, semicolons, double quotes.
- Import order: React/Next.js, third-party, `@/` alias imports, then relative imports.
- Path alias: `@/*` maps to `pathora/frontend/src/*`.
- Keep `page.tsx`, `layout.tsx`, and route handlers thin; move business logic to components, services, hooks, or utils.
- TypeScript is `strict: false`; still prefer narrow explicit types and avoid `any`.
- Components use `PascalCase`; hooks use `useXxx`; constants use `UPPER_SNAKE_CASE`; route folders stay lowercase.
- Add `"use client"` only when client-only behavior is required.
- Use `extractItems`, `extractResult`, and `extractData` from `src/utils/apiResponse.ts` to unwrap API payloads.
- Normalize frontend failures with `handleApiError`; keep 401 cleanup/redirect behavior centralized.
- Keep dashboard/admin experiences API-driven; do not add new seeded fallback datasets as default behavior.
- Keep `src/i18n/locales/en.json` and `src/i18n/locales/vi.json` in sync.
- Do not modify or import from `src/pages-legacy` or `src/layout-legacy`.

### 5.4 Mobile (`tour-guide-mobile`, Expo/React Native)
- TypeScript strict mode is enabled; keep types explicit.
- Formatting: 2-space indentation, semicolons, double quotes.
- Import order: React/React Native, third-party, then project-relative imports.
- Naming: screens/components `PascalCase`, hooks `useXxx`, helpers `camelCase`, constants `UPPER_SNAKE_CASE`.
- Keep API base URL logic centralized in `src/config/api.ts`.
- Local API defaults to `5182` and uses `10.0.2.2` on Android emulator unless `EXPO_PUBLIC_API_BASE_URL` is set.
- Persist auth/session data through `expo-secure-store` helpers in `src/storage/sessionStorage.ts`.
- Prefer the existing TanStack Query + Zustand patterns over new state-management approaches.
- Handle network failures at service or hook boundaries and surface user-safe error messages.

## 6) Testing and Validation Expectations
- Backend: xUnit tests live in `panthora_be/tests/Domain.Specs`; prefer method names like `Method_WhenCondition_ShouldExpected`.
- Frontend: Vitest tests live in `__tests__` and can be run by file or `-t` filter.
- Mobile: no formal test suite; use `tsc --noEmit`, `check:hardcoded`, and manual verification of impacted flows.
- For risky changes, run focused tests first, then broader validation before handoff.

## 7) Security and High-Impact Areas
- Follow `docs/hardcoded-value-governance.md` for runtime hardcoded values.
- Treat auth, cookies, CORS, cache, storage, migrations, and Docker Compose changes as high impact.
- Frontend API env var: `NEXT_PUBLIC_API_GATEWAY`.
- Mobile API env var: `EXPO_PUBLIC_API_BASE_URL`.

## 8) Root Orchestration Defaults
- At `D:\DoAn`, default role is orchestrating work across backend, frontend, and mobile boundaries.
- Prefer implementing inside the target repo and defer to the nearest repo-level `AGENTS.md` once inside it.
- End work with concise validation notes: commands run and outcomes.

Last reviewed: 2026-03-20.
