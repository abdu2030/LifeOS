import { Activity, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'

import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency, getFinanceTotals } from '../utils/financeChartData'

export function FinanceWidget() {
  const { error, isLoading, transactions } = useTransactions()
  const totals = getFinanceTotals(transactions)

  if (isLoading) {
    return <p className="finance-empty">Loading finance summary...</p>
  }

  if (error) {
    return <p className="auth-error">{error.message}</p>
  }

  if (!transactions.length) {
    return (
      <div className="finance-widget-empty">
        <Wallet size={28} />
        <strong>No finance data yet</strong>
        <span>Add or import transactions to populate this widget.</span>
      </div>
    )
  }

  return (
    <div className="finance-widget">
      <div className="finance-widget-balance">
        <span>Current balance</span>
        <strong>{formatCurrency(totals.balance)}</strong>
      </div>

      <div className="finance-widget-stat-grid">
        <span>
          <ArrowUpRight size={16} />
          Income
          <strong>{formatCurrency(totals.income)}</strong>
        </span>
        <span>
          <ArrowDownRight size={16} />
          Expenses
          <strong>{formatCurrency(totals.expense)}</strong>
        </span>
        <span>
          <Activity size={16} />
          Transfers
          <strong>{formatCurrency(totals.transfers)}</strong>
        </span>
      </div>
    </div>
  )
}
