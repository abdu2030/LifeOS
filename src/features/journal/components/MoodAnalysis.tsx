import { BrainCircuit } from 'lucide-react'
import { useState } from 'react'

import { analyzeMood, type MoodAnalysisResult } from '../services/moodAnalysisService'
import { MoodRingFull } from './MoodRingFull'

type MoodAnalysisProps = {
  entryText: string
  onApplyScore: (score: number) => void
}

export function MoodAnalysis({ entryText, onApplyScore }: MoodAnalysisProps) {
  const [analysis, setAnalysis] = useState<MoodAnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  async function handleAnalyze() {
    setError('')
    setIsAnalyzing(true)

    try {
      const result = await analyzeMood(stripHtml(entryText))
      setAnalysis(result)
      onApplyScore(result.score)
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Unable to analyze mood.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="finance-panel mood-analysis-panel">
      <div>
        <span className="auth-eyebrow">AI Mood</span>
        <h2>Gemini mood analysis</h2>
        <p>Use the current journal text to estimate mood and emotional themes.</p>
      </div>

      <button
        className="primary-action compact-action"
        disabled={isAnalyzing}
        onClick={handleAnalyze}
        type="button"
      >
        <BrainCircuit size={17} />
        {isAnalyzing ? 'Analyzing...' : 'Analyze mood'}
      </button>

      {analysis ? (
        <div className="mood-analysis-result">
          <MoodRingFull label={analysis.label} score={analysis.score} />
          <p>{analysis.summary}</p>
          <div>
            {analysis.emotions.map((emotion) => (
              <span key={emotion}>{emotion}</span>
            ))}
          </div>
        </div>
      ) : null}

      {error ? <p className="auth-error">{error}</p> : null}
    </section>
  )
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
