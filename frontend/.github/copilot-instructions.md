# Copilot Instructions

## Project Overview

Pathora is an admin dashboard/portal. The repository currently contains only a **frontend** in `frontend/`. It is built with Next.js 16 (App Router) and React 19, communicating with a backend API gateway via Axios and receiving real-time updates via SignalR.

## Commands

All commands must be run from the `frontend/` directory.

```sh
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build (also serves as the primary validation step)
npm run lint       # ESLint (core-web-vitals + TypeScript rules)
```

There is no test suite. Validate changes with `npm run lint && npm run build`.

## Environment Variables

- `NEXT_PUBLIC_API_GATEWAY` — Backend API base URL (defaults to `http://localhost:5182`)
- `NEXT_PUBLIC_REMOTE_IMAGE_HOSTS` — Comma-separated list of allowed remote image hostnames for `next/image`

## Architecture

### Routing (App Router)

Two route groups under `src/app/`:

- `(auth)/` — Public: login, register, forgot-password
- `(dashboard)/` — Protected: dashboard, products, orders, customers, inventories, categories, brands, coupons, notifications, profile, settings, invoice

Dynamic routes use `[id]` and `[orderNo]` params. Auth middleware (`src/middleware.ts`) uses the `auth_status` cookie for redirects (currently disabled for development).

### State Management

- **Redux Toolkit** — Global state for auth, layout, cart (`src/store/index.ts`)
- **RTK Query** — API data fetching/caching (`src/store/api/apiSlice.ts`); tag types: `Products`, `Orders`, `Customers`, `Dashboard`, `events`, `Auth`
- **React Context** — Auth operations (`src/contexts/AuthContext.tsx`)
- Domain types live in `src/store/domain/`; slices in `src/store/infrastructure/`
- Layout preferences persist to localStorage

### API Layer

Two parallel API mechanisms exist:

1. **Axios `api` helper** (`src/api/axiosInstance.ts`) — Used by domain services in `src/services/`. Injects bearer token from `access_token` cookie, auto-redirects on 401, shows i18n error toasts. Services call `api.get()`, `api.post()`, etc. with endpoints from `src/api/endpoints.ts`.
2. **RTK Query `apiSlice`** (`src/store/api/apiSlice.ts`) — Used for declarative data fetching in components via `injectEndpoints`.

Backend responses wrap data in `{ result: { items: [...] } }` or `{ data: ... }`. Use `extractItems<T>()` and `extractResult<T>()` from `src/utils/apiResponse.ts` to unwrap them.

### Authentication

Cookie-based auth using `access_token` and `auth_status` cookies. The `AuthContext` (`src/contexts/AuthContext.tsx`) provides login/logout/register. Keycloak integration available via `keycloakService.ts`.

### Real-time

SignalR via `src/services/signalRService.ts`. The `useRealtimeRefresh` hook subscribes to a notification key and entity, then calls `onRefresh` when events arrive.

### Internationalization

i18next with `en` and `vi` locales in `src/i18n/locales/`. Language initializes to `en` on server/first render for hydration safety, then `hydrateClientLanguage()` syncs to the user's preferred language on the client.

### Styling

Tailwind CSS v4 with Sass. Supports dark mode, RTL, and multiple layout modes via custom hooks in `src/hooks/` (e.g., `useDarkMode`, `useRtl`, `useSidebar`). Theme config in `src/configs/themeConfig.ts`. A `buildThemeInitScript()` runs inline in `<head>` to prevent flash of unstyled content.

## Key Conventions

- **Path alias**: `@/*` maps to `./src/*` (e.g., `@/components/ui/Button`)
- **Formatting**: 2-space indentation, semicolons, double quotes
- **TypeScript**: Strict mode is **off** (`"strict": false` in tsconfig). Avoid `any`; use `unknown` when type is uncertain.
- **Components**: PascalCase files and exports; organized into `src/components/ui/` (primitives), `src/components/partials/` (feature-specific, by domain)
- **Hooks**: camelCase with `use` prefix
- **Forms**: React Hook Form + Yup for validation
- **API responses**: Use `extractItems<T>()` / `extractResult<T>()` from `src/utils/apiResponse.ts` to unwrap backend payloads
- **New image hosts**: Add to `NEXT_PUBLIC_REMOTE_IMAGE_HOSTS` env var or update `images.remotePatterns` in `next.config.ts`
- **Legacy code**: `src/pages-legacy` and `src/layout-legacy` are excluded from builds — do not modify or reference
