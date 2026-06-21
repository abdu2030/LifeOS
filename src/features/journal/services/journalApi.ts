import { supabase } from '../../../lib/supabase'
import type { JournalEntry, JournalEntryInput } from '../types/journal'

type JournalEntryRow = {
  body: string
  created_at: string
  entry_at: string
  id: string
  is_encrypted: boolean
  mood_score: number | string | null
  tags: string[]
  title: string | null
  updated_at: string
  user_id: string
}

const journalSelect =
  'id,user_id,title,body,mood_score,tags,is_encrypted,entry_at,created_at,updated_at'

function mapJournalEntry(row: JournalEntryRow): JournalEntry {
  return {
    body: row.body,
    createdAt: row.created_at,
    entryAt: row.entry_at,
    id: row.id,
    isEncrypted: row.is_encrypted,
    moodScore: row.mood_score === null ? null : Number(row.mood_score),
    tags: row.tags,
    title: row.title,
    updatedAt: row.updated_at,
    userId: row.user_id,
  }
}

export async function listJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select(journalSelect)
    .eq('user_id', userId)
    .order('entry_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => mapJournalEntry(row as JournalEntryRow))
}

export async function upsertEntry(userId: string, input: JournalEntryInput) {
  const payload = {
    body: input.body,
    entry_at: input.entryAt ?? new Date().toISOString(),
    id: input.id,
    is_encrypted: input.isEncrypted ?? false,
    mood_score: input.moodScore ?? null,
    tags: input.tags ?? [],
    title: input.title || null,
    user_id: userId,
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .upsert(payload)
    .select(journalSelect)
    .single()

  if (error) {
    throw error
  }

  return mapJournalEntry(data as JournalEntryRow)
}
