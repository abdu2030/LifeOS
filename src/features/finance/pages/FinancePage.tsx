import { CategoryManager } from '../components/CategoryManager'
import { CashflowLineChart } from '../components/charts/CashflowLineChart'
import { CategoryPieChart } from '../components/charts/CategoryPieChart'
import { DailySpendingBarChart } from '../components/charts/DailySpendingBarChart'
import { TransactionTypeBarChart } from '../components/charts/TransactionTypeBarChart'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { useTransactions } from '../hooks/useTransactions'

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
