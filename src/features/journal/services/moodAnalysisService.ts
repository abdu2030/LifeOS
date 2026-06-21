import { supabase } from '../../../lib/supabase'

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
    throw error
  }

  if (!data) {
    throw new Error('Mood analysis returned no data.')
  }

  return data
}
