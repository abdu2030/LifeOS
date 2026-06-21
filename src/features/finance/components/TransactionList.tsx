import { Trash2 } from 'lucide-react'

import type { Transaction } from '../types/finance'

type TransactionListProps = {
  error?: Error | null
  isDeleting: boolean
  isLoading: boolean
  onDelete: (transactionId: string) => Promise<unknown>
  transactions: Transaction[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

export function TransactionList({
  error,
  isDeleting,
  isLoading,
  onDelete,
  transactions,
}: TransactionListProps) {
  return (
    <section className="finance-panel transaction-list-panel">
      <div>
        <span className="auth-eyebrow">Transactions</span>
        <h2>Recent activity</h2>
        <p>Review and clean up your latest finance records.</p>
      </div>

      {isLoading ? <p className="finance-empty">Loading transactions...</p> : null}
      {error ? <p className="auth-error">{error.message}</p> : null}

      {!isLoading && !transactions.length ? (
        <p className="finance-empty">No transactions yet. Add your first record to begin.</p>
      ) : null}

      <div className="transaction-list">
        {transactions.map((transaction) => (
          <article className="transaction-row" key={transaction.id}>
            <span className={`transaction-type ${transaction.type}`}>{transaction.type}</span>
            <div>
              <strong>{transaction.category}</strong>
              <p>{transaction.description || 'No description'}</p>
            </div>
            <time>{transaction.occurredOn}</time>
            <strong>
              {transaction.type === 'expense' ? '-' : '+'}
              {currencyFormatter.format(transaction.amount)}
            </strong>
            <button
              className="icon-action"
              disabled={isDeleting}
              onClick={() => void onDelete(transaction.id)}
              type="button"
              aria-label={`Delete ${transaction.category} transaction`}
            >
              <Trash2 size={15} />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
