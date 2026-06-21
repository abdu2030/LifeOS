import { useMemo, useState } from 'react'

import { JournalEditor } from '../components/JournalEditor'
import { JournalEntryList } from '../components/JournalEntryList'
import { JournalSearch } from '../components/JournalSearch'
import { MoodTimeline } from '../components/MoodTimeline'
import { useJournal } from '../hooks/useJournal'

export function JournalPage() {
  const { entries, error, isLoading, isSaving, upsertEntry } = useJournal()
  const [searchQuery, setSearchQuery] = useState('')
  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return entries
    }

    return entries.filter((entry) =>
      [entry.title ?? '', entry.body, entry.tags.join(' ')].join(' ').toLowerCase().includes(query),
    )
  }, [entries, searchQuery])

  return (
    <section className="journal-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Journal</span>
          <h2>Write, protect, and understand your mood</h2>
          <p>
            Start with rich text entries today; encryption and mood intelligence build from here.
          </p>
        </div>
      </div>

      <MoodTimeline entries={entries} />

      <div className="journal-layout-grid">
        <JournalEditor isSaving={isSaving} onSave={upsertEntry} />
        <div className="journal-side-stack">
          <JournalSearch onChange={setSearchQuery} value={searchQuery} />
          <JournalEntryList entries={filteredEntries} error={error} isLoading={isLoading} />
        </div>
      </div>
    </section>
  )
}
