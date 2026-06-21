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
  const plainText = stripHtml(entryText)
  const canAnalyze = plainText.length > 0

  async function handleAnalyze() {
    if (!canAnalyze) {
      setError('Write something in the journal before analyzing mood.')
      return
    }

    setError('')
    setIsAnalyzing(true)

    try {
      const result = await analyzeMood(plainText)
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
        disabled={isAnalyzing || !canAnalyze}
        onClick={handleAnalyze}
        type="button"
      >
        <BrainCircuit size={17} />
        {isAnalyzing ? 'Analyzing...' : 'Analyze mood'}
      </button>

      {analysis ? (
        <div className="mood-analysis-result">
          <div className="mood-analysis-result__main">
            <MoodRingFull label={analysis.label} score={analysis.score} size="compact" />
            <div className="mood-analysis-result__copy">
              <span>AI readout</span>
              <p>{analysis.summary}</p>
            </div>
          </div>
          <div className="mood-analysis-result__chips" aria-label="Detected emotions">
            {analysis.emotions.slice(0, 4).map((emotion) => (
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
