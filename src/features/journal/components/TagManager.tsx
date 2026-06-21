import { Plus, X } from 'lucide-react'
import { useState } from 'react'

type TagManagerProps = {
  onChange: (tags: string[]) => void
  tags: string[]
}

export function TagManager({ onChange, tags }: TagManagerProps) {
  const [draftTag, setDraftTag] = useState('')

  function addTag() {
    const normalizedTag = draftTag.trim().toLowerCase()

    if (!normalizedTag || tags.includes(normalizedTag)) {
      return
    }

    onChange([...tags, normalizedTag])
    setDraftTag('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter((item) => item !== tag))
  }

  return (
    <div className="tag-manager">
      <label className="auth-field">
        Tags
        <span>
          <input
            onChange={(event) => setDraftTag(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addTag()
              }
            }}
            placeholder="gratitude"
            value={draftTag}
          />
          <button className="icon-action" onClick={addTag} type="button" aria-label="Add tag">
            <Plus size={16} />
          </button>
        </span>
      </label>

      {tags.length ? (
        <div className="journal-tag-list">
          {tags.map((tag) => (
            <button key={tag} onClick={() => removeTag(tag)} type="button">
              {tag}
              <X size={13} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
