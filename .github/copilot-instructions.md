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

- `NEXT_PUBLIC_API_GATEWAY` — Backend API base URL (defaults to `http://localhost:5000`)

## Architecture

### Routing (App Router)

Two route groups under `src/app/`:

- `(auth)/` — Public: login, register, forgot-password
- `(dashboard)/` — Protected: dashboard, products, orders, customers, inventories, categories, brands, coupons, notifications, profile, settings, invoice

Auth middleware (`src/middleware.ts`) uses the `auth_status` cookie for redirects (currently disabled for development).

### State Management

- **Redux Toolkit** — Global state for auth, layout, cart (`src/store/index.ts`)
- **RTK Query** — API data fetching/caching (`src/store/api/apiSlice.ts`)
- **React Context** — Auth operations (`src/contexts/AuthContext.tsx`)
- Domain types live in `src/store/domain/`; slices in `src/store/infrastructure/`

### API Layer

- Centralized Axios instance with interceptors (`src/api/axiosInstance.ts`) — injects bearer token, auto-redirects on 401
- Endpoints defined in `src/api/endpoints.ts`
- Domain services in `src/services/` (catalogService, orderService, inventoryService, discountService, etc.)

### Real-time

SignalR via `src/services/signalRService.ts`. The `useRealtimeRefresh` hook triggers data refetches on server events.

### Internationalization

i18next with `en` and `vi` locales in `src/i18n/locales/`. Error toasts include i18n translation support.

### Styling

Tailwind CSS v4 with Sass. Supports dark mode, RTL, and multiple layout modes via custom hooks in `src/hooks/` (e.g., `useDarkMode`, `useRtl`, `useSidebar`). Theme config in `src/configs/themeConfig.ts`.

## Key Conventions

- **Path alias**: `@/*` maps to `./src/*` (e.g., `@/components/ui/Button`)
- **Formatting**: 2-space indentation, semicolons, double quotes
- **Components**: PascalCase files and exports; organized into `src/components/ui/` (primitives), `src/components/partials/` (feature-specific, by domain)
- **Hooks**: camelCase with `use` prefix
- **Forms**: React Hook Form + Yup for validation
- **API responses**: Use extraction helpers in `src/utils/apiResponse.ts`
- **Legacy code**: `src/pages-legacy` and `src/layout-legacy` are excluded from builds — do not use; prefer `src/app/`
