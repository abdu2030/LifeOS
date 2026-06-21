import { CategoryManager } from '../components/CategoryManager'
import { CashflowLineChart } from '../components/charts/CashflowLineChart'
import { CategoryPieChart } from '../components/charts/CategoryPieChart'
import { DailySpendingBarChart } from '../components/charts/DailySpendingBarChart'
import { TransactionTypeBarChart } from '../components/charts/TransactionTypeBarChart'
import { CSVImporter } from '../components/CSVImporter'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { useTransactions } from '../hooks/useTransactions'
import type { TransactionInput } from '../types/finance'

export function FinancePage() {
  const {
    createTransaction,
    deleteTransaction,
    error,
    isCreating,
    isDeleting,
    isLoading,
    transactions,
  } = useTransactions()

  async function handleImport(transactionsToImport: TransactionInput[]) {
    await Promise.all(transactionsToImport.map((transaction) => createTransaction(transaction)))
  }

  return (
    <section className="finance-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Finance</span>
          <h2>Track your money clearly</h2>
          <p>Record transactions, review spending, and keep categories organized.</p>
        </div>
      </div>

      <div className="finance-chart-grid">
        <CashflowLineChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
        <DailySpendingBarChart transactions={transactions} />
        <TransactionTypeBarChart transactions={transactions} />
      </div>

      <div className="finance-layout-grid">
        <TransactionForm isSubmitting={isCreating} onSubmit={createTransaction} />
        <CategoryManager />
        <CSVImporter onImport={handleImport} />
        <TransactionList
          error={error}
          isDeleting={isDeleting}
          isLoading={isLoading}
          onDelete={deleteTransaction}
          transactions={transactions}
        />
      </div>
    </section>
  )
}
