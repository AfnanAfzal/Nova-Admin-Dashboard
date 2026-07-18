# Nova Admin — Enterprise SaaS Dashboard

A production-quality admin dashboard frontend built with React 19, TypeScript, Vite, Tailwind CSS,
shadcn/ui-style components, TanStack Query, Zustand, React Hook Form + Zod, Recharts, and Framer Motion.

Inspired by a reference marketplace admin panel, redesigned with a distinctive indigo/violet
enterprise SaaS visual identity, deeper information hierarchy, and a fuller feature set.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

Sign in on the login screen with **any email address** and the password:

```
demo1234
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## Project structure

```
src/
  components/
    ui/            reusable primitives (button, card, dialog, table, select, ...)
    layout/        Sidebar, Topbar, MobileNav, AppLayout
    dashboard/     Dashboard-only widgets (charts, activity feed, quick actions, ...)
    common/        shared building blocks (PageHeader, DataTable helpers, EmptyState, ...)
  pages/           one file per route
  hooks/           TanStack Query data hooks (simulated CRUD) + generic useTable/useDebounce
  store/           Zustand stores (auth, theme, sidebar) with persistence
  data/            local JSON mock data (users, products, orders, categories, messages, ...)
  types/           shared TypeScript interfaces
  routes/          ProtectedRoute guard
```

## Notes

- All data is mocked locally in `src/data/*.json` and mutated in-memory through the hooks in
  `src/hooks`; there is no backend. Refreshing the page resets any changes.
- Auth state, theme, and sidebar collapse state persist to `localStorage` via Zustand's
  `persist` middleware.
- Tables support search, column sorting, status/category filtering, and pagination through the
  generic `useTable` hook — see `src/pages/Users.tsx`, `Products.tsx`, and `Orders.tsx` for usage.
- Dark mode is class-based (`class="dark"` on `<html>`) and fully covers every page.
