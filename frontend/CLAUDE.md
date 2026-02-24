# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pathora is an admin dashboard/portal built with **Next.js 16** (App Router) and **React 19**. It manages products, orders, customers, inventory, categories, brands, coupons, and notifications. The frontend communicates with a backend API gateway and supports real-time updates via SignalR.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Environment Variables

- `NEXT_PUBLIC_API_GATEWAY` — Backend API base URL (defaults to `http://localhost:5000`)

## Architecture

### Routing

Next.js App Router with two route groups:
- `(auth)/` — Public pages: login, register, forgot-password
- `(dashboard)/` — Protected pages: dashboard, products, orders, customers, inventories, categories, brands, coupons, notifications, profile, settings, invoice

Dynamic routes use `[id]` and `[orderNo]` params. Middleware (`src/middleware.ts`) handles auth redirects using the `auth_status` cookie.

### State Management

- **Redux Toolkit** for global state (auth, layout, cart) — store configured in `src/store/index.ts`
- **RTK Query** (`src/store/api/apiSlice.ts`) for API data fetching and caching
- **React Context** (`src/contexts/AuthContext.tsx`) for auth operations (login, logout, register)
- Layout preferences persist to localStorage

### API Layer

- Centralized Axios instance (`src/api/axiosInstance.ts`) with interceptors for bearer token injection and error handling
- API endpoints defined in `src/api/endpoints.ts`
- Domain-specific services in `src/services/` (authService, catalogService, orderService, inventoryService, discountService, etc.)
- Auto-redirect to login on 401 responses
- Error toasts with i18n translation support

### Authentication

Cookie-based auth (`access_token`, `auth_status` cookies). AuthProvider initializes session and wraps the app. Keycloak integration available via `keycloakService.ts`.

### Styling

Tailwind CSS v4 with Sass support. Dark mode, RTL, and multiple layout modes supported via custom hooks (`useDarkMode`, `useRtl`, `useMenulayout`, `useSidebar`, etc.). Theme defaults in `src/configs/themeConfig.ts`.

### Internationalization

i18next with English (`en`) and Vietnamese (`vi`) locales in `src/i18n/locales/`. Config in `src/i18n/config.ts`.

### Real-time

SignalR (`@microsoft/signalr`) for live data updates. `useRealtimeRefresh` hook triggers data refetches on server events.

## Key Conventions

- Path alias: `@/*` maps to project root (e.g., `@/src/components/...`)
- TypeScript strict mode enabled
- Form validation uses React Hook Form + Yup
- API response extraction helpers in `src/utils/apiResponse.ts`
- Store domain types in `src/store/domain/`, infrastructure (slices) in `src/store/infrastructure/`
- Components organized by domain: `src/components/partials/` for feature-specific, `src/components/ui/` for primitives
