import { defaultFinanceCategories } from '../data/financeCategories'
import type { Transaction, TransactionType } from '../types/finance'

export type FinanceSeriesPoint = {
  label: string
  income: number
  expense: number
  net: number
}

export type FinanceCategoryTotal = {
  category: string
  color: string
  total: number
}

export type FinanceTypeTotal = {
  type: TransactionType
  total: number
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

const categoryColorMap = new Map(
  defaultFinanceCategories.map((category) => [category.name, category.color]),
)

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function getCashflowSeries(transactions: Transaction[]): FinanceSeriesPoint[] {
  const buckets = new Map<string, FinanceSeriesPoint>()

  transactions.forEach((transaction) => {
    const date = new Date(`${transaction.occurredOn}T00:00:00`)
    const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const current = buckets.get(label) ?? { expense: 0, income: 0, label, net: 0 }

    if (transaction.type === 'income') {
      current.income += transaction.amount
      current.net += transaction.amount
    }

    if (transaction.type === 'expense') {
      current.expense += transaction.amount
      current.net -= transaction.amount
    }

    buckets.set(label, current)
  })

  return Array.from(buckets.values()).slice(-6)
}

export function getCategoryBreakdown(transactions: Transaction[]): FinanceCategoryTotal[] {
  const categoryTotals = new Map<string, number>()

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      categoryTotals.set(
        transaction.category,
        (categoryTotals.get(transaction.category) ?? 0) + transaction.amount,
      )
    })

  return Array.from(categoryTotals.entries())
    .map(([category, total]) => ({
      category,
      color: categoryColorMap.get(category) ?? '#60a5fa',
      total,
    }))
    .sort((first, second) => second.total - first.total)
    .slice(0, 6)
}

export function getDailySpendingSeries(transactions: Transaction[]): FinanceSeriesPoint[] {
  const buckets = new Map<string, FinanceSeriesPoint>()

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      const date = new Date(`${transaction.occurredOn}T00:00:00`)
      const label = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      const current = buckets.get(label) ?? { expense: 0, income: 0, label, net: 0 }
      current.expense += transaction.amount
      current.net -= transaction.amount
      buckets.set(label, current)
    })

  return Array.from(buckets.values()).slice(-10)
}

export function getTransactionTypeTotals(transactions: Transaction[]): FinanceTypeTotal[] {
  return (['income', 'expense', 'transfer'] as TransactionType[]).map((type) => ({
    type,
    total: transactions
      .filter((transaction) => transaction.type === type)
      .reduce((sum, transaction) => sum + transaction.amount, 0),
  }))
}

export function getFinanceTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === 'income') {
        totals.income += transaction.amount
        totals.balance += transaction.amount
      }

      if (transaction.type === 'expense') {
        totals.expense += transaction.amount
        totals.balance -= transaction.amount
      }

      if (transaction.type === 'transfer') {
        totals.transfers += transaction.amount
      }

      return totals
    },
    { balance: 0, expense: 0, income: 0, transfers: 0 },
  )
}
