import type { JournalEntry } from '../types/journal'
import { EncryptionBadge } from './EncryptionBadge'

type JournalEntryListProps = {
  entries: JournalEntry[]
  error?: Error | null
  isLoading: boolean
}

export function JournalEntryList({ entries, error, isLoading }: JournalEntryListProps) {
  return (
    <section className="finance-panel journal-list-panel">
      <div>
        <span className="auth-eyebrow">Recent Entries</span>
        <h2>Journal history</h2>
        <p>Review your saved reflections and mood patterns.</p>
      </div>

      {isLoading ? <p className="finance-empty">Loading journal entries...</p> : null}
      {error ? <p className="auth-error">{error.message}</p> : null}
      {!isLoading && !entries.length ? (
        <p className="finance-empty">No entries yet. Save your first reflection.</p>
      ) : null}

      <div className="journal-entry-list">
        {entries.map((entry) => (
          <article className="journal-entry-row" key={entry.id}>
            <div>
              <strong>{entry.title || 'Untitled entry'}</strong>
              <time>{new Date(entry.entryAt).toLocaleDateString()}</time>
            </div>
            <EncryptionBadge isEncrypted={entry.isEncrypted} />
            {entry.moodScore !== null ? <b>{entry.moodScore}/10</b> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
