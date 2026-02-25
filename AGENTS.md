# Pathora - Agent Development Guidelines

## Project Overview

Pathora is an admin dashboard/portal built with Next.js 16 (App Router) and React 19. The repository contains a frontend application in the `frontend/` directory, communicating with a backend API gateway via Axios and receiving real-time updates via SignalR.

---

## Build, Test, and Development Commands

All commands must be run from the `frontend/` directory.

### Installation
```bash
cd frontend
npm ci                    # Install dependencies from package-lock.json
```

### Development
```bash
npm run dev              # Start dev server at http://localhost:3000
```

### Building & Validation
```bash
npm run build            # Production build (primary validation step)
npm run start            # Run production server after build
npm run lint             # Run ESLint (Next.js core-web-vitals + TypeScript rules)
```

### Testing
There is no dedicated test framework. For validation, run:
```bash
npm run lint && npm run build
```

To run a single test (if tests are added later):
```bash
npx vitest run <file>    # If using Vitest
npx jest <file>          # If using Jest
```

---

## Code Style Guidelines

### General Principles

- **Language**: TypeScript + React (Next.js 16, React 19)
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Quotes**: Double quotes for strings
- **Line endings**: Unix-style (LF)

### File Organization

- Core code lives in `src/`
- App Router entry files in `src/app/` (`layout.tsx`, `page.tsx`, `not-found.tsx`)
- Reusable UI components in `src/components/ui/`
- Feature-specific partials in `src/components/partials/`
- Skeleton loaders in `src/components/skeleton/`
- API layer in `src/api/`
- Services in `src/services/`
- State management in `src/store/`
- Custom hooks in `src/hooks/`
- Localization in `src/i18n/locales/` (`en.json`, `vi.json`)
- Legacy code excluded from builds: `src/pages-legacy`, `src/layout-legacy`

---

## Import Conventions

### Path Alias
Use the `@/*` alias for imports (maps to `./src/*`):
```typescript
// Good
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// Avoid
import { Button } from '../../../components/ui/Button';
```

### Import Order (Recommended)
1. React/Next imports
2. External libraries
3. Path alias imports (`@/*`)
4. Relative imports
5. Type imports

```typescript
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/store/domain/types';
import { formatDate } from '@/utils/dateUtils';
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `HeroSection.tsx`, `UserProfile.tsx` |
| Component Exports | PascalCase | `export default HeroSection` |
| Hooks | camelCase with `use` prefix | `useAuth.ts`, `useDarkMode.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Variables/Functions | camelCase | `isLoading`, `handleSubmit` |
| Interfaces/Types | PascalCase | `UserProps`, `ApiResponse<T>` |
| Enums | PascalCase | `UserRole`, `OrderStatus` |
| Files (general) | camelCase or PascalCase | `apiUtils.ts`, `HeroSection.tsx` |
| Route Segments | lowercase | `(auth)/login/page.tsx` |

---

## TypeScript Guidelines

### Type Annotations
- Use explicit types for function parameters and return values when not inferrable
- Prefer interfaces for object shapes, types for unions/intersections
- Use generics for reusable components

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): Promise<User> => {
  return axios.get(`/users/${id}`);
};

// Good - Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <>{items.map(renderItem)}</>;
}
```

### Strict Mode
TypeScript strict mode is disabled (`"strict": false`). Be mindful of:
- Implicit `any` - avoid using `any`, use `unknown` if type is uncertain
- Null/undefined handling - always check for nullish values

---

## Component Guidelines

### Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ComponentProps {
  title: string;
  onSubmit: () => void;
}

export default function MyComponent({ title, onSubmit }: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, []);

  const handleClick = () => {
    setIsLoading(true);
    onSubmit();
  };

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick} disabled={isLoading}>
        Submit
      </Button>
    </div>
  );
}
```

### Best Practices
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props
- Destructure props for clarity

---

## Error Handling

### API Errors
Use centralized axios interceptors for error handling (`src/api/axiosInstance.ts`):
```typescript
// The axios instance automatically:
// - Injects bearer token
// - Redirects to login on 401
// - Handles common errors

try {
  const response = await axiosInstance.get('/endpoint');
} catch (error) {
  // Use error.response?.data for API error messages
  console.error(error);
}
```

### Form Validation
Use React Hook Form + Yup for form validation:
```typescript
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters'),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

### Error Toasts
Use react-toastify with i18n support for user-facing errors.

---

## State Management

### Redux Toolkit
- Global state for auth, layout, cart in `src/store/index.ts`
- RTK Query for API data fetching in `src/store/api/apiSlice.ts`
- Domain types in `src/store/domain/`
- Slices in `src/store/infrastructure/`

```typescript
// Use RTK Query for API calls
import { apiSlice } from '@/store/api/apiSlice';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
  }),
});
```

### React Context
Use for auth operations in `src/contexts/AuthContext.tsx`.

---

## Routing (App Router)

### Route Groups
- `(auth)/` - Public routes: login, register, forgot-password
- `(dashboard)/` - Protected routes: dashboard, products, orders, customers, etc.

### Middleware
Auth middleware in `src/middleware.ts` uses `auth_status` cookie for redirects.

---

## Internationalization

- i18next for translations
- Locales in `src/i18n/locales/`: `en.json`, `vi.json`
- Use translation keys in components:
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('common.welcome')}</h1>;
```

---

## Styling

### Tailwind CSS v4
- Use Tailwind utility classes consistently
- Theme configuration in `src/configs/themeConfig.ts`
- Supports dark mode, RTL, multiple layouts

### Custom Hooks for Theming
- `useDarkMode` - dark mode toggle
- `useRtl` - RTL support
- `useSidebar` - sidebar state

### Sass
Available for custom styles in `src/styles/`.

---

## Security Guidelines

- **Never commit secrets** - `.env*` files are ignored
- **Environment variables**: `NEXT_PUBLIC_API_GATEWAY` (defaults to `http://localhost:5000`)
- **New image hosts**: Update `images.remotePatterns` in `next.config.ts`

---

## Git Workflow

### Commit Messages
Use concise, imperative subjects:
```
Internationalize landing and header components
Standardize Tailwind utility classes
Fix login redirect issue
```

### Pull Requests
Include:
- What changed and why
- Linked issue/task ID
- Validation commands run (`npm run lint && npm run build`)
- Screenshots for UI changes

---

## Validation Checklist

Before submitting changes, run:
```bash
cd frontend
npm run lint
npm run build
```

For UI changes, manually verify:
- Auth flows
- Internationalization (en/vi)
- Dashboard widgets
- Responsive layouts
