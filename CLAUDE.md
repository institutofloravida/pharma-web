# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite, auto-opens browser)
- **Build:** `npm run build` (TypeScript compile + Vite build)
- **Lint:** `npm run lint` (ESLint with Rocketseat React config)
- **Preview prod build:** `npm run preview`
- **No test runner is configured.**

## Architecture

React 18 + TypeScript + Vite pharmacy management system (FloraVida). Uses React Router v6, React Query v5, React Hook Form + Zod, Shadcn/ui (new-york style), and Tailwind CSS.

### Path alias

`@/*` maps to `./src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Directory layout

- `src/api/pharma/` — API layer organized by domain (auth, operators, users, medicines-variants, dispensation, movement, inventory, stock, reports, dashboard, auxiliary-records). Each module exports async functions that take params + token and return typed responses.
- `src/api/ibge/` and `src/api/viacep/` — External API integrations for Brazilian address/location data.
- `src/lib/axios.ts` — Three Axios instances (`apiPharma`, `apiIBGE`, `apiViaCep`). In development mode, a 1-second delay interceptor is added to `apiPharma`.
- `src/contexts/authContext.tsx` — Auth context: token in localStorage, validates on mount via `/validate-token`, provides `login()`, `logout()`, `selectInstitution()`, operator details, and role info.
- `src/pages/` — Route-mapped page components under `app/panel/` (dashboard, CRUD pages) and `app/auth/` (sign-in). Layouts in `_layouts/`, route protection in `_private/`.
- `src/components/ui/` — Shadcn/ui primitives. Custom components alongside (selects, comboboxes, dialogs, skeletons, sidebar).
- `src/lib/utils/` — Utility functions. `src/lib/reports/` — PDF report generation (pdfmake/jsPDF).
- `src/lib/data/sidebar-config.ts` — Sidebar navigation structure.

### Key patterns

- **Routing:** `createBrowserRouter` in `src/routes.tsx`. Protected routes wrapped in `PrivateRoute` with `allowedRoles` prop. Three roles: `COMMON`, `MANAGER`, `SUPER_ADMIN`.
- **Data fetching:** React Query mutations/queries. Query keys follow `['resource-name']` or `['resource-name', id]`. Invalidate queries after mutations.
- **Forms:** React Hook Form + Zod schema validation throughout.
- **Auth flow:** Email/password login → JWT stored in localStorage (`'token'`). Multi-institution support with institution ID also in localStorage (`'institutionId'`).
- **Styling:** Tailwind CSS with CSS variables (HSL) for theming. Dark mode via `next-themes`. Prettier sorts Tailwind classes.

### Environment variables

Defined in `.env` and validated with Zod in `src/env.ts`:
- `VITE_API_PHARMA_URL` — Backend API URL
- `VITE_API_IBGE_URL` — IBGE API URL
- `VITE_API_VIA_CEP_URL` — ViaCEP API URL

### ESLint

Extends `@rocketseat/eslint-config/react` with Prettier compatibility. Several rules relaxed (see `eslint.config.mjs`).
