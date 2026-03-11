# Repository Guidelines for Agentic Coding Assistants

## Purpose
- This file is the source of truth for coding agents working in `D:\DoAn\pathora`.
- Workspace tracks:
  - root review/orchestration: `D:\DoAn\pathora`
  - backend implementation: `D:\DoAn\panthora_be`
  - frontend implementation: `D:\DoAn\pathora\frontend`
- Main app stack in this workspace: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 + Sass, Redux Toolkit, RTK Query, Axios, SignalR, i18next (`en`, `vi`), Vitest.

## Working Directory
- Root orchestration/review tasks run from `D:\DoAn\pathora`.
- Frontend Node/npm commands run from `frontend/`.

## Install, Build, Lint, Test, and Dev
```bash
npm ci
npm run dev
npm run lint
npm run test
npm run build
npm run start
npm run analyze
```
- `dev`: local server at `http://localhost:3000`.
- `lint`: ESLint via `frontend/eslint.config.mjs` (Next core-web-vitals + TypeScript rules).
- `test`: `vitest run --pool=threads --maxWorkers=1 --no-file-parallelism`.
- `build`: production build gate; `start`: serve production build.
- `analyze`: bundle analysis build (`ANALYZE=true next build`).

## Running a Single Test (Important)
```bash
# Run one test file
npm run test -- src/utils/__tests__/apiResponse.test.ts

# Run one test by name pattern
npm run test -- src/utils/__tests__/apiResponse.test.ts -t "extracts items from nested result.items"
```
- Always use npm argument forwarding (`--`) before Vitest filters.
- Keep `-t` patterns specific to avoid running/skipping unintended tests.

## Recommended Validation Gate
```bash
cd frontend && npm run lint && npm run test && npm run build
```

## Repository Structure
```text
frontend/
  src/app/                         App Router pages/layouts
    (dashboard)/                   Protected dashboard/admin routes
    auth/                          Auth callback route(s)
    home/, tours/, checkout/, ...  Public-facing routes
  src/components/ui/               Reusable UI primitives
  src/components/partials/         Feature/domain components
  src/api/                         Axios setup, interceptors, endpoint map
  src/services/                    Service wrappers around API calls
  src/store/                       Redux store + RTK Query
  src/hooks/                       Custom hooks (theme, layout, realtime)
  src/contexts/                    React context providers
  src/i18n/                        i18next config and locale JSON files
  src/utils/                       Shared helpers (API unwrapping, auth cookies)
```
- `src/pages-legacy` and `src/layout-legacy` are excluded by TS config; do not place new code there.

## Architecture and Data Flow
- Keep protected/admin flows under `src/app/(dashboard)`.
- Global state setup is `src/store/index.ts`.
- RTK Query base API is `src/store/api/apiSlice.ts`.
- Axios instance and interceptors are in `src/api/axiosInstance.ts`.
- Services in `src/services/` call Axios helpers or `executeApiRequest` wrappers.
- Auth session helpers are in `src/utils/authSession.ts`.
- Middleware auth gating is in `src/middleware.ts` and uses `access_token` / `auth_status` plus `auth_portal` for portal route guards.

## Formatting Rules
- Use 2-space indentation.
- Use semicolons.
- Use double quotes.
- Preserve LF line endings.
- No project-level Prettier config is present; follow existing file style and ESLint output.

## Import Conventions
- Preferred import order:
  1. React/Next imports
  2. External packages
  3. Alias imports (`@/...`)
  4. Relative imports (`./`, `../`)
  5. `import type` near related imports
- Prefer alias paths for shared modules (`@/*` maps to `frontend/src/*`).
- Keep import groups compact; avoid unnecessary blank lines.

## TypeScript Conventions
- `strict` is `false`; do not assume strict-mode safety.
- Avoid `any`; prefer `unknown` with narrowing.
- Add explicit types for exported functions, service APIs, and complex returns.
- Reuse shared types in `src/types/` and `src/store/domain/` when applicable.

## Naming Conventions
- Components: PascalCase (`TourCard.tsx`).
- Hooks: `use` + camelCase (`useRealtimeRefresh.ts`).
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS`).
- Types/interfaces: PascalCase (`ApiResponse<T>`).
- Utilities/functions: camelCase (`extractResult`).
- Route folders: lowercase except dynamic segments (`[id]`) and route groups (`(dashboard)`).

## API Response and Service Conventions
- Backend payloads are commonly wrapped in `result`, `data`, and sometimes nested `items`.
- Prefer helpers from `src/utils/apiResponse.ts`:
  - `extractItems<T>()`
  - `extractResult<T>()`
  - `extractData<T>()`
- Service modules returning normalized outcomes should use `executeApiRequest` from `src/services/serviceExecutor.ts` and return `ApiResponse<T>`.

## Error Handling Conventions
- Use `try/catch` around async service-level operations, or use `executeApiRequest` to centralize.
- Normalize unknown/Axios errors with `handleApiError()`.
- Keep unauthorized handling centralized in Axios interceptors (`clearAuthSession`, redirect behavior).
- Prefer i18n error keys under `error_response.*` for user-visible messages.
- Do not duplicate 401 cleanup logic in multiple places.

## Forms, i18n, and Styling
- Forms: React Hook Form + Yup.
- i18n: use `useTranslation()` and keep `en.json` and `vi.json` keys in sync.
- Keep first render language deterministic (`en`) and rely on hydration sync logic in `src/i18n/config.ts`.
- Styling uses Tailwind utilities plus Sass; preserve existing dark/RTL/layout behavior.

## Environment and Security
- Never commit secrets or `.env*` values.
- Important environment variables:
  - `NEXT_PUBLIC_API_GATEWAY` (defaults to `http://localhost:5182`)
  - `NEXT_PUBLIC_REMOTE_IMAGE_HOSTS` (comma-separated host allowlist)
  - `NEXT_PUBLIC_IMAGES_UNOPTIMIZED` (`true` to bypass Next image optimizer)
- Remote image patterns and security headers are in `frontend/next.config.ts`.

## Cursor and Copilot Rules
- Cursor rules check:
  - No `.cursorrules` file found in this repository.
  - No `.cursor/rules/` directory found in this repository.
- Copilot rules exist in `.github/copilot-instructions.md`; follow these key points:
  - Run commands from `frontend/`.
  - Preserve auth and dashboard routing patterns.
  - Respect cookie auth conventions (`access_token`, `refresh_token`, `auth_status`, `auth_portal`).
  - Prefer `extractItems` / `extractResult` for response unwrapping.
- Copilot instructions mention no test suite, but `frontend/package.json` defines `npm run test`; trust package scripts as latest source of truth.

## Root Orchestrator Role
- Default role in `D:\DoAn\pathora`: Root Orchestrator/Reviewer.
- For `/opsx-propose`, create synchronized changes across root/backend/frontend with the same change name.
- Root track handles contract alignment and final review; worker tracks handle implementation.

## Commit and PR Guidance
- Keep commits scoped to one logical change.
- Use short imperative commit messages.
- Do not mix broad refactors with feature delivery unless requested.
- PRs should include summary, rationale, linked task, validation commands, and UI evidence for visual changes.
