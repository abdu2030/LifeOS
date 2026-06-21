# Supabase Setup

This guide covers the Supabase work for the first LifeOS setup milestone: project creation, database schema, row-level security, and Auth providers.

## 1. Create the Supabase Project

1. Open Supabase and create a new project.
2. Save the project URL and anon public key.
3. Copy `.env.example` to `.env`.
4. Fill in:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
```

If your Supabase dashboard or template gives you `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, copy those values into the matching `VITE_`
variables for local Vite development. The app client also accepts the `NEXT_PUBLIC_`
names for compatibility.

For production, set `VITE_AUTH_REDIRECT_URL` to the deployed app callback URL.

## 2. Run the Database Schema

Run the SQL migration in:

```txt
supabase/migrations/001_initial_schema.sql
```

The migration creates:

- Profiles linked to Supabase Auth users.
- Tasks and focus task storage.
- Habits and habit logs.
- Journal entries with mood scores.
- Goal tree records.
- Finance accounts and finance records.
- Planner events and reminders.
- Weekly insight summaries.
- Row-level security policies for each user-owned table.
- A trigger that creates a profile when a new Auth user is created.

## 3. Enable Email Auth

In Supabase Auth settings:

1. Enable Email provider.
2. Keep email confirmation enabled for production.
3. Add the local redirect URL:

```txt
http://localhost:5173/auth/callback
```

4. Add the production redirect URL when the app is deployed.

## 4. Enable Google OAuth

In Supabase Auth providers:

1. Enable Google.
2. Create OAuth credentials in Google Cloud Console.
3. Add the Supabase callback URL from the Google provider screen to Google Cloud.
4. Paste the Google client ID and secret into Supabase.
5. Add these site URLs and redirects in Supabase:

```txt
http://localhost:5173
http://localhost:5173/auth/callback
```

## 5. App Integration

LifeOS auth helpers live in:

```txt
src/features/auth/services/authService.ts
src/features/auth/hooks/useAuthSession.ts
```

The service currently supports:

- Email sign up.
- Email sign in.
- Google OAuth sign in.
- Sign out.
- Session loading.

## 6. Verification Checklist

After the project is connected:

1. Run `npm run dev`.
2. Confirm `.env` values are loaded.
3. Create a user with email auth.
4. Confirm a matching row appears in `public.profiles`.
5. Confirm another signed-in user cannot read that profile or private records.
6. Test Google OAuth from the local app URL.
