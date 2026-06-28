# LifeOS

LifeOS is a privacy-first personal operating system dashboard for managing money,
habits, journaling, goals, planning, weekly insights, widgets, settings, and
offline sync from one responsive PWA.

## Features

- Authenticated app shell with responsive sidebar navigation, topbar search,
  profile controls, and theme support.
- Dashboard overview cards for finance, habits, journal mood, goals, weekly
  insights, focus tasks, expenses, and reminders.
- Custom widget dashboard with drag, resize, add, remove, reset layout, and
  local fallback persistence when the remote layout table is unavailable.
- Finance tools for transactions, categories, CSV import, cashflow charts,
  category breakdowns, daily spending, and transaction type summaries.
- Habit tracking with daily check-ins, streaks, freeze-token support, heatmaps,
  and notifications.
- Encrypted journal workflow with rich text editing, mood analysis, tags,
  search, mood ring, and timeline views.
- Goals module with hierarchy, milestones, progress, habit linking, and an
  interactive tree view.
- Calendar and planning views for events and reminders.
- Weekly insights reports backed by Supabase functions.
- Offline provider, queued sync services, PWA manifest, and service worker
  configuration.
- Settings, files, and plugin/module overview pages.

## Tech Stack

- React 19, TypeScript, Vite, and React Router.
- Supabase Auth, database, row-level security, and Edge Functions.
- TanStack Query for server state.
- Zustand for lightweight UI state.
- TipTap for journal editing.
- Recharts and D3 for charts and visualizations.
- React Grid Layout for the custom widget dashboard.
- Vitest, ESLint, Prettier, and TypeScript project checks.

## Project Structure

```txt
src/
  app/
    layout/
    routes/
  features/
    auth/
    dashboard/
    files/
    finance/
    goals/
    habits/
    insights/
    journal/
    offline/
    planner/
    plugins/
    settings/
    tasks/
    widgets/
  lib/
  providers/
  shared/
  stores/
  types/
supabase/
  functions/
  migrations/
tests/
```

Each feature owns its pages, hooks, services, components, and types where
possible. Shared UI primitives live in `src/shared`, app-wide providers live in
`src/providers`, and Supabase access is routed through service modules rather
than page components.

## Local Development

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Fill in the Supabase values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Supabase Setup

Run the migrations in order:

```txt
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_widget_layouts.sql
supabase/migrations/003_habit_freeze_tokens.sql
supabase/migrations/004_goal_details.sql
supabase/migrations/005_weekly_report_markdown.sql
```

Then configure Supabase Auth redirect URLs:

```txt
http://localhost:5173/auth/callback
https://your-production-domain/auth/callback
```

More setup detail is in [docs/supabase-setup.md](./docs/supabase-setup.md).

## Scripts

```bash
npm run dev
npm run type-check
npm run lint
npm run test
npm run build
npm run qa
npm run format:check
npm run format
```

`npm run qa` runs type-check, lint, tests, and production build.

## Deployment

The app is configured for Vercel as a Vite SPA. See
[docs/vercel-deployment.md](./docs/vercel-deployment.md) for build settings,
environment variables, Supabase Auth URLs, Edge Function notes, and launch QA.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the planned build direction and product
principles.

## Git Workflow

Keep commits small and focused. Every commit should contain a real source,
documentation, or configuration improvement and should describe the actual
change made.
