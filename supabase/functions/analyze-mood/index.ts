import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

type GeminiCandidate = {
  content?: {
    parts?: Array<{ text?: string }>
  }
}

type MoodAnalysis = {
  emotions: string[]
  label: string
  score: number
  summary: string
}

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Origin': '*',
}

serve(async (request) => {
  try {
    if (request.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY secret.')
      return json({ error: 'Missing GEMINI_API_KEY secret.' }, 500)
    }

    const { text } = (await request.json()) as { text?: string }

    if (!text?.trim()) {
      return json({ error: 'Journal text is required.' }, 400)
    }

    const prompt = `
Analyze this journal entry mood. Return strict JSON only with:
score: number from 0 to 10,
label: short mood label,
summary: one sentence,
emotions: array of 3 short emotion words.

Journal entry:
${text}
`

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        method: 'POST',
      },
    )

    const responseText = await response.text()

    if (!response.ok) {
      console.error('Gemini request failed', {
        body: responseText,
        status: response.status,
      })
      return json(
        {
          detail: safeParseErrorMessage(responseText),
          error: 'Gemini mood analysis failed.',
          status: response.status,
        },
        response.status,
      )
    }

    const result = JSON.parse(responseText) as { candidates?: GeminiCandidate[] }
    const textResult = result.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textResult) {
      console.error('Gemini returned no text result', result)
      return json({ error: 'Gemini returned no mood analysis text.' }, 502)
    }

    return json(parseMoodAnalysis(textResult))
  } catch (error) {
    console.error('Mood analysis function crashed', error)
    return json(
      {
        detail: error instanceof Error ? error.message : 'Unknown function error.',
        error: 'Mood analysis function crashed.',
      },
      500,
    )
  }
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })
}

function parseMoodAnalysis(value: string): MoodAnalysis {
  const normalized = value
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim()
  const parsed = JSON.parse(normalized) as Partial<MoodAnalysis>

  return {
    emotions: Array.isArray(parsed.emotions) ? parsed.emotions.slice(0, 3).map(String) : [],
    label: String(parsed.label ?? 'Reflective'),
    score: clampScore(Number(parsed.score ?? 5)),
    summary: String(parsed.summary ?? 'Mood analysis completed.'),
  }
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 5
  }

  return Math.max(0, Math.min(10, value))
}

function safeParseErrorMessage(value: string) {
  try {
    const parsed = JSON.parse(value) as { error?: { message?: string } }
    return parsed.error?.message ?? value
  } catch {
    return value
  }
}
