import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = normalizeEnvValue(
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
)
export const supabaseAnonKey = normalizeEnvValue(
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export function getSupabaseConfigurationError() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'
  }

  if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
    return 'Supabase is still using placeholder credentials. Replace them with values from your Supabase project.'
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(supabaseUrl)) {
    return 'Supabase URL looks invalid. Use the project URL from Supabase Project Settings > API.'
  }

  return null
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)

function normalizeEnvValue(value: string | undefined) {
  return value?.trim().replace(/^(['"])(.*)\1$/, '$2') ?? ''
}
