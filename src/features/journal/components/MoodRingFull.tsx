type MoodRingFullProps = {
  label?: string
  score: number
}

export function MoodRingFull({ label = 'Mood', score }: MoodRingFullProps) {
  const normalizedScore = Math.max(0, Math.min(score, 10))
  const circumference = 2 * Math.PI * 48
  const dashOffset = circumference - (normalizedScore / 10) * circumference

  return (
    <div className="mood-ring-full">
      <svg
        viewBox="0 0 120 120"
        role="img"
        aria-label={`${label} mood score ${normalizedScore} out of 10`}
      >
        <circle cx="60" cy="60" r="48" />
        <circle
          cx="60"
          cy="60"
          r="48"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div>
        <strong>{normalizedScore.toFixed(1)}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}
