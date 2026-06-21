# LifeOS

LifeOS is a privacy-first personal operating system dashboard for finance, habits, journaling, goals, planning, and weekly insights. The current app focuses on a polished dashboard experience while the codebase is being organized for long-term feature growth.

## Current Features

- Dark-first dashboard UI with finance, habits, journal mood, goals, insights, focus tasks, expenses, and reminders.
- Feature-owned seed data and services for dashboard, tasks, habits, and planner reminders.
- Shared avatar and dashboard card header components.
- TanStack Query provider and Supabase client placeholder for future data access.
- PWA manifest configuration for offline-friendly app behavior.

See [ROADMAP.md](./ROADMAP.md) for the milestone plan we will build against.

## Architecture

LifeOS uses a feature-based clean architecture with a service layer. UI components render the interface, hooks prepare feature state for pages, and services own data access or seed data until real storage/API calls are connected.

```txt
src/
  App.tsx
  features/
    dashboard/
      components/
      data/
      hooks/
      pages/
      services/
      types/
    habits/
      data/
      services/
      types/
    planner/
      data/
      services/
      types/
    tasks/
      data/
      services/
      types/
  shared/
    components/
  providers/
  lib/
```

### Module Ownership

- `features/dashboard` owns the dashboard page, layout sections, dashboard navigation data, and the overview hook.
- `features/tasks` owns focus task types, seed data, and task retrieval services.
- `features/habits` owns habit heatmap types, seed data, and habit summary services.
- `features/planner` owns reminder types, seed data, and reminder retrieval services.
- `shared/components` stores reusable UI primitives used across features.

## Local Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` when Supabase and Gemini credentials are ready.

## Useful Checks

```bash
npm run type-check
npm run build
npm run lint
```

## Git Workflow

Make small, focused commits that contain real source changes. Keep feature logic inside its feature folder, move reusable UI into `shared/components`, and route data access through service files rather than directly from page components.
