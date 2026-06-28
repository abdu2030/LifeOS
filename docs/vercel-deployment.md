# Vercel Deployment

Use this checklist for the Day 7 launch pass.

## Build Settings

Vercel can import the GitHub repository as a Vite project. The repository includes `vercel.json` with:

- Build command: `npm run build`
- Output directory: `dist`
- SPA route fallback to `index.html`
- No-cache headers for the generated service worker
- Immutable cache headers for built assets

## Environment Variables

Set these in Vercel Project Settings, for Production and Preview:

```env
VITE_SUPABASE_URL=https://drknucltrbjgxjddvltn.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
VITE_AUTH_REDIRECT_URL=https://your-vercel-domain.vercel.app/auth/callback
```

Vite reads these values at build time. After adding or changing them in Vercel,
redeploy the project. A deployment built before the variables were fixed will
continue to use the old values.

If Supabase labels the public key as a publishable key, this alias is also
accepted:

```env
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

The app also accepts these compatibility names if needed:

```env
NEXT_PUBLIC_SUPABASE_URL=https://drknucltrbjgxjddvltn.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Do not put `GEMINI_API_KEY` in Vercel. Gemini mood analysis runs through the Supabase Edge Function, so keep that secret in Supabase:

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase functions deploy analyze-mood
```

## Supabase Auth URLs

After Vercel gives the project a production URL, update Supabase Auth settings:

Site URL:

```txt
https://your-vercel-domain.vercel.app
```

Redirect URLs:

```txt
https://your-vercel-domain.vercel.app/auth/callback
http://localhost:5173/auth/callback
```

If Google OAuth is enabled, make sure the Google Cloud OAuth client still points to the Supabase callback URL shown in the Supabase Google provider screen.

## Final QA

Run:

```bash
npm run qa
```

For files touched during launch work, run Prettier directly before committing. A full `npm run format:check` is useful before a formatting sweep, but the current codebase still has older formatting warnings outside the deployment files.

Then verify in the deployed app:

1. Email sign up, sign in, and log out.
2. Google sign in redirects back to `/auth/callback`.
3. Dashboard cards load real user data.
4. Finance transaction creation and CSV import.
5. Habit creation, check-in, streaks, heatmap, and notifications.
6. Journal entry save, encryption badge, mood analysis, search, and tags.
7. Goal creation, milestone progress, habit linking, and tree view.
8. Calendar event creation and hover detail.
9. Weekly report generation and saved report history.
10. PWA install prompt, offline mode, queued sync, and service worker refresh.
