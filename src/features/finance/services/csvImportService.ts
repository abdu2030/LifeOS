import Papa from 'papaparse'

import type {
  CsvColumnMapping,
  CsvImportResult,
  CsvTransactionRow,
  TransactionInput,
  TransactionType,
} from '../types/finance'

const csvColumnAliases: Record<keyof CsvColumnMapping, string[]> = {
  amount: ['amount', 'value', 'total', 'debit', 'credit'],
  category: ['category', 'type category', 'merchant category'],
  description: ['description', 'memo', 'merchant', 'name', 'details'],
  occurredOn: ['date', 'transaction date', 'posted date', 'occurred on'],
  type: ['type', 'transaction type', 'kind'],
}

export function parseTransactionsCsv(file: File): Promise<CsvTransactionRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvTransactionRow>(file, {
      complete: (results) => {
        if (results.errors.length) {
          reject(new Error(results.errors[0]?.message ?? 'Unable to parse CSV file.'))
          return
        }

        resolve(
          results.data.filter((row) =>
            Object.values(row).some((value) => String(value ?? '').trim().length > 0),
          ),
        )
      },
      error: (error) => reject(error),
      header: true,
      skipEmptyLines: true,
      worker: true,
    })
  })
}

export function inferCsvColumnMapping(columns: string[]): CsvColumnMapping {
  const normalizedColumns = columns.map((column) => ({
    label: column,
    normalized: column.trim().toLowerCase(),
  }))

  return Object.fromEntries(
    Object.entries(csvColumnAliases).map(([field, aliases]) => {
      const match = normalizedColumns.find((column) => aliases.includes(column.normalized))
      return [field, match?.label ?? '']
    }),
  ) as CsvColumnMapping
}

export function mapCsvRowsToTransactions(
  rows: CsvTransactionRow[],
  mapping: CsvColumnMapping,
): CsvImportResult {
  const transactions: TransactionInput[] = []
  let rejectedRows = 0

  rows.forEach((row) => {
    const amount = parseAmount(row[mapping.amount])
    const occurredOn = parseDate(row[mapping.occurredOn])

    if (!amount || !occurredOn) {
      rejectedRows += 1
      return
    }

    transactions.push({
      amount: Math.abs(amount),
      category: cleanValue(row[mapping.category]) || 'Uncategorized',
      description: cleanValue(row[mapping.description]),
      occurredOn,
      type: parseTransactionType(row[mapping.type], amount),
    })
  })

  return { rejectedRows, transactions }
}

function cleanValue(value: string | undefined) {
  return String(value ?? '').trim()
}

function parseAmount(value: string | undefined) {
  const normalized = cleanValue(value).replace(/[$,\s]/g, '')
  const amount = Number(normalized)
  return Number.isFinite(amount) && amount !== 0 ? amount : null
}

function parseDate(value: string | undefined) {
  const date = new Date(cleanValue(value))

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString().slice(0, 10)
}

function parseTransactionType(value: string | undefined, amount: number): TransactionType {
  const normalized = cleanValue(value).toLowerCase()

  if (normalized.includes('income') || normalized.includes('credit')) {
    return 'income'
  }

  if (normalized.includes('transfer')) {
    return 'transfer'
  }

  if (normalized.includes('expense') || normalized.includes('debit')) {
    return 'expense'
  }

  return amount < 0 ? 'expense' : 'income'
}
