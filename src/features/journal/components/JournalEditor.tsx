import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Heading2, Italic, List, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

import { EncryptionBadge } from './EncryptionBadge'
import { MoodAnalysis } from './MoodAnalysis'
import { TagManager } from './TagManager'
import { encryptText } from '../services/encryptionService'
import type { JournalEntryInput } from '../types/journal'

type JournalEditorProps = {
  isSaving: boolean
  onSave: (input: JournalEntryInput) => Promise<unknown>
}

export function JournalEditor({ isSaving, onSave }: JournalEditorProps) {
  const [title, setTitle] = useState('')
  const [moodScore, setMoodScore] = useState(7)
  const [passphrase, setPassphrase] = useState('')
  const [status, setStatus] = useState('')
  const [shouldEncrypt, setShouldEncrypt] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const editor = useEditor({
    content: '',
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write what happened, what you felt, and what you want to remember...',
      }),
    ],
  })

  useEffect(() => () => editor?.destroy(), [editor])

  async function handleSave() {
    if (!editor) {
      return
    }

    const body = editor.getHTML()
    const isEncrypted = shouldEncrypt && passphrase.length >= 8

    if (shouldEncrypt && passphrase.length < 8) {
      setStatus('Use at least 8 characters for encrypted entries.')
      return
    }

    await onSave({
      body: isEncrypted ? await encryptText(body, passphrase) : body,
      isEncrypted,
      moodScore,
      tags,
      title,
    })

    setStatus(isEncrypted ? 'Encrypted journal entry saved.' : 'Journal entry saved.')
  }

  return (
    <section className="finance-panel journal-editor-panel">
      <div>
        <span className="auth-eyebrow">Journal</span>
        <h2>Reflect with rich text</h2>
        <p>Capture the day with formatting, mood, and a private-first writing flow.</p>
      </div>

      <label className="auth-field">
        Title
        <input
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Today felt..."
          value={title}
        />
      </label>

      <label className="auth-field">
        Mood score: {moodScore}/10
        <input
          max="10"
          min="0"
          onChange={(event) => setMoodScore(Number(event.target.value))}
          step="0.5"
          type="range"
          value={moodScore}
        />
      </label>

      <div className="journal-encryption-row">
        <EncryptionBadge isEncrypted={shouldEncrypt} />
        <label>
          <input
            checked={shouldEncrypt}
            onChange={(event) => setShouldEncrypt(event.target.checked)}
            type="checkbox"
          />
          Encrypt this entry
        </label>
      </div>

      {shouldEncrypt ? (
        <label className="auth-field">
          Encryption passphrase
          <input
            onChange={(event) => setPassphrase(event.target.value)}
            placeholder="At least 8 characters"
            type="password"
            value={passphrase}
          />
        </label>
      ) : null}

      <TagManager onChange={setTags} tags={tags} />

      <div className="journal-toolbar" aria-label="Editor formatting">
        <button
          className={editor?.isActive('bold') ? 'active' : ''}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          type="button"
          aria-label="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          className={editor?.isActive('italic') ? 'active' : ''}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          type="button"
          aria-label="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          type="button"
          aria-label="Heading"
        >
          <Heading2 size={16} />
        </button>
        <button
          className={editor?.isActive('bulletList') ? 'active' : ''}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          type="button"
          aria-label="Bullet list"
        >
          <List size={16} />
        </button>
      </div>

      <EditorContent className="journal-editor" editor={editor} />

      <MoodAnalysis entryText={editor?.getHTML() ?? ''} onApplyScore={setMoodScore} />

      {status ? <p className="auth-success">{status}</p> : null}

      <button
        className="auth-submit journal-save-button"
        disabled={isSaving}
        onClick={handleSave}
        type="button"
      >
        <Save size={17} />
        {isSaving ? 'Saving...' : 'Save entry'}
      </button>
    </section>
  )
}
