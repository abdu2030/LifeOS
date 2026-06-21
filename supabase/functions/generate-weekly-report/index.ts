import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

type WeeklyMetrics = {
  financeDelta: number
  goalProgress: number
  habitScore: number
  moodAverage: number | null
  topGoals: string[]
  weekStart: string
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
      return json({ error: 'Missing GEMINI_API_KEY secret.' }, 500)
    }

    const { metrics } = (await request.json()) as { metrics?: WeeklyMetrics }

    if (!metrics) {
      return json({ error: 'Weekly metrics are required.' }, 400)
    }

    const prompt = `
Create a concise weekly LifeOS report in Markdown.
Use these exact sections:
## Weekly Summary
## Wins
## Risks
## Next Actions

Keep it personal, practical, and under 180 words.

Metrics:
week_start=${metrics.weekStart}
finance_delta=${metrics.financeDelta}
habit_score=${metrics.habitScore}
mood_average=${metrics.moodAverage ?? 'not enough data'}
goal_progress=${metrics.goalProgress}
top_goals=${metrics.topGoals.join(', ') || 'none'}
`

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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
      return json(
        {
          detail: safeParseErrorMessage(responseText),
          error: 'Gemini weekly report generation failed.',
          status: response.status,
        },
        response.status,
      )
    }

    const result = JSON.parse(responseText) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const reportMarkdown = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!reportMarkdown) {
      return json({ error: 'Gemini returned no weekly report text.' }, 502)
    }

    return json({ reportMarkdown })
  } catch (error) {
    return json(
      {
        detail: error instanceof Error ? error.message : 'Unknown function error.',
        error: 'Weekly report function crashed.',
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

function safeParseErrorMessage(value: string) {
  try {
    const parsed = JSON.parse(value) as { error?: { message?: string } }
    return parsed.error?.message ?? value
  } catch {
    return value
  }
}
