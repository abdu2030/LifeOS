# LifeOS Build Roadmap

LifeOS is a privacy-first personal operating system dashboard for finance, habits,
journaling, goals, weekly insights, offline use, and plugins.

## North Star

Everything about your life in one beautiful tab: money, habits, goals, thoughts,
and weekly intelligence. The app should feel calm, fast, private, and useful even
when the user is offline.

## Current Milestone

Build the first usable foundation:

- Polished dashboard shell with sidebar, topbar, and core widgets
- Auth-ready app structure
- Supabase-ready data layer
- PWA-ready setup
- Roadmap-aligned source folders
- Passing type check, lint, and production build

## Week 1: Foundation

- App layout: sidebar, topbar, dashboard route
- Provider layer: query, theme, offline, auth
- Supabase client and environment setup
- Auth pages: login, register, onboarding start
- Empty dashboard states for first-time users

Deliverable: a user can sign in and see their dashboard.

## Week 2: Dashboard Engine And Finance

- Widget registry and widget wrapper
- Drag, resize, add, remove, and persist widgets
- Finance data model and API hooks
- Transaction form, list, categories, budgets
- Finance charts and CSV import flow

Deliverable: finance tracking works end to end.

## Week 3: Habits

- Habit CRUD and daily check-ins
- Streak calculation with freeze-token support
- Habit heatmap with hover details
- Reminder notification setup
- Habit widget wired to real data

Deliverable: habit tracking works end to end.

## Week 4: Journal

- TipTap journal editor
- Browser-side AES-GCM encryption utilities
- Journal entries stored encrypted
- AI mood analysis endpoint integration
- Mood timeline, tags, and search

Deliverable: encrypted journal with mood analysis.

## Week 5: Goals And Insights

- Goal hierarchy data model and API hooks
- Interactive goal tree with progress states
- Goal-habit linking
- Weekly aggregation service
- AI report generation and report history

Deliverable: goal tree and weekly insights work end to end.

## Week 6: Offline, Polish, Launch

- Service worker cache strategies
- IndexedDB offline queue
- Background sync and sync status UI
- Settings pages
- Theme polish
- Unit and integration tests
- Vercel deployment

Deliverable: production-ready PWA.

## Build Principles

- Privacy first: journal keys never leave the browser.
- Offline first: core writing and tracking flows should keep working without a
  connection.
- Beautiful by default: every empty, loading, and error state should feel cared
  for.
- Modular by design: each widget should be replaceable, movable, and eventually
  extensible through plugins.
