import { supabase, supabaseAnonKey, supabaseUrl } from '../../../lib/supabase'

export type MoodAnalysisResult = {
  emotions: string[]
  label: string
  score: number
  summary: string
}

export async function analyzeMood(text: string): Promise<MoodAnalysisResult> {
  const { data, error } = await supabase.functions.invoke<MoodAnalysisResult>('analyze-mood', {
    body: { text },
  })

  if (error) {
    return invokeMoodAnalysisDirectly(text)
  }

  if (!data) {
    throw new Error('Mood analysis returned no data.')
  }

  return data
}

async function invokeMoodAnalysisDirectly(text: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const response = await fetch(`${supabaseUrl}/functions/v1/analyze-mood`, {
    body: JSON.stringify({ text }),
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session?.access_token ?? supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const payload = (await response.json()) as MoodAnalysisResult & {
    detail?: string
    error?: string
  }

  if (!response.ok) {
    throw new Error(
      payload.detail || payload.error || `Mood analysis failed with status ${response.status}.`,
    )
  }

  return payload
}
