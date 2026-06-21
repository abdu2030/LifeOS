import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { JournalEntry } from '../types/journal'

type MoodTimelineProps = {
  entries: JournalEntry[]
}

export function MoodTimeline({ entries }: MoodTimelineProps) {
  const data = entries
    .filter((entry) => entry.moodScore !== null)
    .slice()
    .reverse()
    .map((entry) => ({
      date: new Date(entry.entryAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      mood: entry.moodScore,
    }))

  return (
    <section className="finance-panel mood-timeline-panel">
      <div>
        <span className="auth-eyebrow">Mood Timeline</span>
        <h2>Mood over time</h2>
        <p>Track how your journal mood score changes across entries.</p>
      </div>

      {data.length ? (
        <ResponsiveContainer height={240} width="100%">
          <LineChart data={data} margin={{ bottom: 6, left: 0, right: 8, top: 8 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} />
            <YAxis domain={[0, 10]} stroke="#94a3b8" tickLine={false} width={36} />
            <Tooltip
              contentStyle={{
                background: '#0b121d',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                borderRadius: 10,
              }}
            />
            <Line dataKey="mood" name="Mood" stroke="#21d07a" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="finance-empty">Save entries with mood scores to build your timeline.</p>
      )}
    </section>
  )
}
