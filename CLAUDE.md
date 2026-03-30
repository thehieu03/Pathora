# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

`D:\DoAn` is an **orchestration directory** (not a git repo) containing three independent repos:

| Repo                 | Stack                                            | Purpose                            |
| -------------------- | ------------------------------------------------ | ---------------------------------- |
| `panthora_be/`       | ASP.NET Core 10.0, Clean Architecture + CQRS     | Backend API                        |
| `pathora/frontend/`  | Next.js 16, React 19, Redux Toolkit, Tailwind v4 | Web frontend (travel/admin portal) |
| `tour-guide-mobile/` | Expo (React Native), TypeScript strict           | Mobile companion app               |

**Default local ports:** API `5182`, frontend `3001`, PostgreSQL `5432`, Redis `6379`, MinIO `9000/9001`.

## Instruction Precedence

1. User instructions (always highest priority)
2. The nearest `AGENTS.md` for the repo being edited
3. This root `CLAUDE.md` for cross-repo/orchestration tasks
4. Repository source/config truth over documentation

**Per-repo guides:** `panthora_be/AGENTS.md`, `pathora/AGENTS.md`, `pathora/frontend/AGENTS.md`.

## Build, Lint, and Test Commands

### Backend (`panthora_be/`)

```bash
dotnet restore panthora_be/LocalService.slnx
dotnet build panthora_be/LocalService.slnx
dotnet build panthora_be/LocalService.slnx -c Release
dotnet format panthora_be/LocalService.slnx --verify-no-changes
dotnet test panthora_be/LocalService.slnx
# Run a single test class
dotnet test panthora_be/tests/Domain.Specs/Domain.Specs.csproj --filter "FullyQualifiedName~CreateTourCommandValidatorTests"
# Run a single test method
dotnet test panthora_be/tests/Domain.Specs/Domain.Specs.csproj --filter "FullyQualifiedName=Domain.Specs.Application.Validators.CreateTourCommandValidatorTests.Validate_WhenTourNameExactly500Chars_ShouldPass"
# Run API
dotnet run --project panthora_be/src/Api/Api.csproj
# Run migrations (requires DB_CONNECTION_STRING)
dotnet run --project panthora_be/src/Infrastructure.DatabaseMigration/Infrastructure.DatabaseMigration.csproj
```

EF migrations (run from `panthora_be/`):

```bash
dotnet ef migrations add <Name> --project src/Infrastructure --startup-project src/Api
dotnet ef database update --project src/Infrastructure --startup-project src/Api
```

### Frontend (`pathora/frontend/`)

```bash
npm ci --prefix pathora/frontend
npm run dev --prefix pathora/frontend          # http://localhost:3001
npm run dev:turbopack --prefix pathora/frontend
npm run lint --prefix pathora/frontend
npm run test --prefix pathora/frontend
npm run build --prefix pathora/frontend
npm run start --prefix pathora/frontend
# Single test file
npm run test --prefix pathora/frontend -- src/utils/__tests__/apiResponse.test.ts -t "extractItems"
```

### Mobile (`tour-guide-mobile/`)

```bash
npm ci --prefix tour-guide-mobile
npm run start --prefix tour-guide-mobile
npm run android --prefix tour-guide-mobile
npm run ios --prefix tour-guide-mobile
npm run web --prefix tour-guide-mobile
npm run check:hardcoded --prefix tour-guide-mobile
npx --prefix tour-guide-mobile tsc --noEmit
```

### Validation Script (Root)

```powershell
# API contract + secret guard checks
powershell -File scripts/validate-workspace.ps1
```

## Architecture

### Backend — Clean Architecture + CQRS (`panthora_be/`)

**Four layers with strict dependency direction (inner → outer):**

```
Domain (entities, enums, value objects, repository contracts)
  ↓
Application (CQRS commands/queries via MediatR, FluentValidation, AutoMapper, service interfaces)
  ↓
Infrastructure (EF Core/PostgreSQL, MinIO storage, Redis+FusionCache, MailKit+Scriban)
  ↓
Api (controllers, Swagger, auth, middleware)
```

**Request pipeline:** Controller → MediatR `Sender.Send()` → `ValidationBehavior` → `LoggingBehavior` (warns if >3s) → Handler → Service → Repository → `AppDbContext`

**Feature structure:** Each command/query, its FluentValidation validator, and its MediatR handler live in **one file** at `Application/Features/{Feature}/{Commands|Queries}/`.

**Error handling:** Expected failures return `ErrorOr<T>`. `BaseApiController` provides `HandleResult()`, `HandleCreated()`, `HandleNoContent()`, etc. with standard HTTP mapping.

**Constants:** Route endpoints in `Api/Endpoint/`, validation/error messages in `Application/Common/Constant/`.

**DI:** Each layer has a `DependencyInjection.cs` registering its own services.

### Frontend — Next.js App Router (`pathora/frontend/`)

**Two parallel API mechanisms:**

1. **Axios `api` helper** (`src/api/axiosInstance.ts`) — Used by domain services. Auto-injects bearer token, redirects on 401.
2. **RTK Query** (`src/store/api/apiSlice.ts`) — Declarative data fetching.

**Response unwrapping:** Backend wraps data in `{ data: ..., message: ..., statusCode: ... }`. Always use helpers from `src/utils/apiResponse.ts`: `extractItems<T>()`, `extractResult<T>()`, `extractData<T>()`, `handleApiError()`.

**Routes:** `(auth)/` for public pages, `(dashboard)/` for protected admin pages. Auth middleware (`src/middleware.ts`) uses `auth_status` cookie.

**i18n:** English and Vietnamese locales in `src/i18n/locales/`. Keep both files in sync.

### Mobile — Expo (`tour-guide-mobile/`)

- API base URL via `EXPO_PUBLIC_API_BASE_URL` in `src/config/api.ts`
- Auth/session via `expo-secure-store` helpers in `src/storage/sessionStorage.ts`
- TanStack Query + Zustand pattern matching the frontend approach
- Android emulator uses `10.0.2.2` for localhost unless `EXPO_PUBLIC_API_BASE_URL` overrides

## Key Conventions

### Backend (C#)

- Entities use `Entity` suffix, extend `Entity<T>` or `Aggregate<TId>` from `Domain/Abstractions/`
- New IDs: `Guid.CreateVersion7()`. Timestamps: `DateTimeOffset` for UTC.
- Private fields: `_camelCase`. File-scoped namespaces.
- Nullable: `string?` for optional, `string` for required. Minimize `!`.
- Async end-to-end. Pass `CancellationToken`.
- **TDD required:** Write a failing test first (RED), implement minimal code to pass (GREEN), then refactor. Do not write production backend code before having a failing test.

### Frontend (TypeScript)

- Path alias: `@/*` → `./src/*`
- TypeScript strict mode is **off**. Avoid `any`; use `unknown` with type guards.
- Components: `PascalCase` in `src/components/ui/` (primitives) and `src/components/partials/` (feature-specific)
- Hooks: `useXxx` in `src/hooks/`
- Forms: React Hook Form + Yup

### Mobile (TypeScript)

- TypeScript strict mode is **on** — keep types explicit
- API config centralized in `src/config/api.ts`
- Session via `src/storage/sessionStorage.ts`
- TanStack Query + Zustand; do not introduce alternative state management

## Hardcoded Value Governance

Follow `docs/hardcoded-value-governance.md`. The workspace has automated guards:

- **Backend:** `dotnet test panthora_be/tests/Domain.Specs/Domain.Specs.csproj --filter "FullyQualifiedName~HardcodedRuntimeGuardTests"`
- **Frontend:** `npm run test --prefix pathora/frontend -- src/utils/__tests__/hardcodedRuntimeGuards.test.ts`
- **Mobile:** `npm run check:hardcoded --prefix tour-guide-mobile`

## GitNexus Code Intelligence

Both `panthora_be` and `pathora` repos are indexed by GitNexus (MCP server available). Before editing any symbol, run `gitnexus_impact` to assess blast radius. Before committing, run `gitnexus_detect_changes` to verify scope. See `panthora_be/AGENTS.md` and `pathora/AGENTS.md` for the full GitNexus workflow.

## Docker

- `docker-compose.yml` defines services: `api`, `frontend`, `redis`, `minio`, `portainer`
- `docker-compose.override.yml` adds local overrides (credentials, ports, env vars)
- `docker-compose up` starts all services. API health at `/health/live`.

## Git Policy

- **Never auto-commit.** Commit only when the user explicitly requests it.
- **Never auto-push.** Push only when the user explicitly requests it.
- Default completion behavior: report changed files + validation commands, no commit created.

## Frontend Design Skills

When implementing or refactoring frontend UI/UX, use available local design skills from `pathora/skills`:

- `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `redesign-existing-projects`, `stitch-design-taste`, `industrial-brutalist-ui`

Apply these to improve layout, typography, spacing, and visual consistency while preserving existing product patterns.

## gstack

Use the /browse skill from gstack for all web browsing.
Never use mcp__claude-in-chrome__* tools.

Available gstack skills:
/office-hours
/plan-ceo-review
/plan-eng-review
/plan-design-review
/design-consultation
/review
/ship
/land-and-deploy
/canary
/benchmark
/browse
/qa
/qa-only
/design-review
/setup-browser-cookies
/setup-deploy
/retro
/investigate
/document-release
/codex
/cso
/autoplan
/careful
/freeze
/guard
/unfreeze
/gstack-upgrade
