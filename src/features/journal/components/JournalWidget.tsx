import { BookOpen } from 'lucide-react'

import { useJournal } from '../hooks/useJournal'
import { MoodRingFull } from './MoodRingFull'

export function JournalWidget() {
  const { entries, error, isLoading } = useJournal()
  const moodEntries = entries.filter((entry) => entry.moodScore !== null)
  const averageMood = moodEntries.length
    ? moodEntries.reduce((sum, entry) => sum + (entry.moodScore ?? 0), 0) / moodEntries.length
    : 0
  const latestEntry = entries[0]

  if (isLoading) {
    return <p className="finance-empty">Loading journal...</p>
  }

  if (error) {
    return <p className="auth-error">{error.message}</p>
  }

  if (!entries.length) {
    return (
      <div className="journal-widget-empty">
        <BookOpen size={28} />
        <strong>No journal entries yet</strong>
        <span>Write your first reflection to track mood here.</span>
      </div>
    )
  }

  return (
    <div className="journal-widget">
      <MoodRingFull label="Avg mood" score={averageMood} />
      <div>
        <span>Latest reflection</span>
        <strong>{latestEntry.title || 'Untitled entry'}</strong>
        <small>{new Date(latestEntry.entryAt).toLocaleDateString()}</small>
      </div>
    </div>
  )
}
