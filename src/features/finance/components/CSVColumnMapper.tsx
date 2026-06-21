import type { CsvColumnMapping } from '../types/finance'

type CSVColumnMapperProps = {
  columns: string[]
  mapping: CsvColumnMapping
  onChange: (mapping: CsvColumnMapping) => void
}

const fields: Array<{ key: keyof CsvColumnMapping; label: string; required: boolean }> = [
  { key: 'occurredOn', label: 'Date', required: true },
  { key: 'amount', label: 'Amount', required: true },
  { key: 'description', label: 'Description', required: false },
  { key: 'category', label: 'Category', required: false },
  { key: 'type', label: 'Type', required: false },
]

export function CSVColumnMapper({ columns, mapping, onChange }: CSVColumnMapperProps) {
  return (
    <div className="csv-column-mapper">
      {fields.map((field) => (
        <label className="auth-field" key={field.key}>
          {field.label}
          <select
            onChange={(event) => onChange({ ...mapping, [field.key]: event.target.value })}
            required={field.required}
            value={mapping[field.key]}
          >
            <option value="">Select column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}
