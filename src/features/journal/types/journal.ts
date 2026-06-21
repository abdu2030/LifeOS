export type JournalEntry = {
  body: string
  createdAt: string
  entryAt: string
  id: string
  isEncrypted: boolean
  moodScore: number | null
  tags: string[]
  title: string | null
  updatedAt: string
  userId: string
}

export type JournalEntryInput = {
  body: string
  entryAt?: string
  id?: string
  isEncrypted?: boolean
  moodScore?: number | null
  tags?: string[]
  title?: string
}
