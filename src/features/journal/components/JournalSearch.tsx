type JournalSearchProps = {
  onChange: (value: string) => void
  value: string
}

export function JournalSearch({ onChange, value }: JournalSearchProps) {
  return (
    <label className="auth-field journal-search">
      Search journal
      <input
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search title, text, or tags"
        value={value}
      />
    </label>
  )
}
