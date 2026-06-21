import { JournalEditor } from '../components/JournalEditor'
import { JournalEntryList } from '../components/JournalEntryList'
import { useJournal } from '../hooks/useJournal'

export function JournalPage() {
  const { entries, error, isLoading, isSaving, upsertEntry } = useJournal()

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

      <div className="journal-layout-grid">
        <JournalEditor isSaving={isSaving} onSave={upsertEntry} />
        <JournalEntryList entries={entries} error={error} isLoading={isLoading} />
      </div>
    </section>
  )
}
