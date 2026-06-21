import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

type GeminiCandidate = {
  content?: {
    parts?: Array<{ text?: string }>
  }
}

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Origin': '*',
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY')

  if (!apiKey) {
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    },
  )

  if (!response.ok) {
    return json({ error: 'Gemini mood analysis failed.' }, response.status)
  }

  const result = (await response.json()) as { candidates?: GeminiCandidate[] }
  const textResult = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'

  return json(JSON.parse(textResult))
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })
}
