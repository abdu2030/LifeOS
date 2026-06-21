import { Upload } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CSVColumnMapper } from './CSVColumnMapper'
import {
  inferCsvColumnMapping,
  mapCsvRowsToTransactions,
  parseTransactionsCsv,
} from '../services/csvImportService'
import type { CsvColumnMapping, CsvTransactionRow, TransactionInput } from '../types/finance'

type CSVImporterProps = {
  onImport: (transactions: TransactionInput[]) => Promise<void>
}

const emptyMapping: CsvColumnMapping = {
  amount: '',
  category: '',
  description: '',
  occurredOn: '',
  type: '',
}

export function CSVImporter({ onImport }: CSVImporterProps) {
  const [columns, setColumns] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [mapping, setMapping] = useState<CsvColumnMapping>(emptyMapping)
  const [message, setMessage] = useState('')
  const [rows, setRows] = useState<CsvTransactionRow[]>([])

  const importResult = useMemo(() => mapCsvRowsToTransactions(rows, mapping), [mapping, rows])
  const canImport = Boolean(
    mapping.amount && mapping.occurredOn && importResult.transactions.length,
  )

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setError('')
    setMessage('')
    setRows([])

    try {
      const parsedRows = await parseTransactionsCsv(file)
      const parsedColumns = Object.keys(parsedRows[0] ?? {})

      setRows(parsedRows)
      setColumns(parsedColumns)
      setMapping(inferCsvColumnMapping(parsedColumns))
      setMessage(`Parsed ${parsedRows.length} CSV rows. Map the columns before importing.`)
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : 'Unable to parse CSV file.')
    }
  }

  async function handleImport() {
    if (!canImport) {
      setError('Map at least the date and amount columns before importing.')
      return
    }

    setIsImporting(true)
    setError('')

    try {
      await onImport(importResult.transactions)
      setMessage(
        `Imported ${importResult.transactions.length} transactions${
          importResult.rejectedRows ? ` and skipped ${importResult.rejectedRows} invalid rows` : ''
        }.`,
      )
      setRows([])
      setColumns([])
      setMapping(emptyMapping)
    } catch (importError) {
      setError(
        importError instanceof Error ? importError.message : 'Unable to import transactions.',
      )
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <section className="finance-panel csv-importer">
      <div>
        <span className="auth-eyebrow">CSV Import</span>
        <h2>Import bank activity</h2>
        <p>Upload a CSV, map its columns, and save clean transactions to Supabase.</p>
      </div>

      <label className="csv-file-drop">
        <Upload size={20} />
        <span>Choose CSV file</span>
        <input
          accept=".csv,text/csv"
          onChange={(event) => void handleFileChange(event)}
          type="file"
        />
      </label>

      {columns.length ? (
        <>
          <CSVColumnMapper columns={columns} mapping={mapping} onChange={setMapping} />
          <div className="csv-import-summary">
            <span>{importResult.transactions.length} ready</span>
            <span>{importResult.rejectedRows} skipped</span>
          </div>
          <button
            className="auth-submit"
            disabled={!canImport || isImporting}
            onClick={handleImport}
            type="button"
          >
            {isImporting ? 'Importing...' : 'Import transactions'}
          </button>
        </>
      ) : null}

      {message ? <p className="auth-success">{message}</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}
    </section>
  )
}
