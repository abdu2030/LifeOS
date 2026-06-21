import { useMemo, useState } from 'react'

import { defaultFinanceCategories } from '../data/financeCategories'
import type { TransactionInput, TransactionType } from '../types/finance'

type TransactionFormProps = {
  isSubmitting: boolean
  onSubmit: (input: TransactionInput) => Promise<unknown>
}

const today = new Date().toISOString().slice(0, 10)

export function TransactionForm({ isSubmitting, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState('Food & Dining')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [occurredOn, setOccurredOn] = useState(today)
  const [formError, setFormError] = useState('')

  const categories = useMemo(
    () => defaultFinanceCategories.filter((financeCategory) => financeCategory.type === type),
    [type],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const parsedAmount = Number(amount)

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError('Enter an amount greater than zero.')
      return
    }

    await onSubmit({
      amount: parsedAmount,
      category,
      description,
      occurredOn,
      type,
    })

    setAmount('')
    setDescription('')
  }

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType)
    setCategory(defaultFinanceCategories.find((item) => item.type === nextType)?.name ?? '')
  }

  return (
    <form className="finance-panel transaction-form" onSubmit={handleSubmit}>
      <div>
        <span className="auth-eyebrow">New Transaction</span>
        <h2>Add money movement</h2>
        <p>Capture income, expenses, and transfers as they happen.</p>
      </div>

      <div className="segmented-control">
        {(['expense', 'income', 'transfer'] as TransactionType[]).map((transactionType) => (
          <button
            className={type === transactionType ? 'active' : ''}
            key={transactionType}
            onClick={() => handleTypeChange(transactionType)}
            type="button"
          >
            {transactionType}
          </button>
        ))}
      </div>

      <label className="auth-field">
        Amount
        <input
          min="0"
          onChange={(event) => setAmount(event.target.value)}
          placeholder="128.00"
          required
          step="0.01"
          type="number"
          value={amount}
        />
      </label>

      <label className="auth-field">
        Category
        <select onChange={(event) => setCategory(event.target.value)} value={category}>
          {categories.map((financeCategory) => (
            <option key={financeCategory.id} value={financeCategory.name}>
              {financeCategory.name}
            </option>
          ))}
        </select>
      </label>

      <label className="auth-field">
        Date
        <input
          onChange={(event) => setOccurredOn(event.target.value)}
          required
          type="date"
          value={occurredOn}
        />
      </label>

      <label className="auth-field">
        Description
        <input
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Lunch with team"
          type="text"
          value={description}
        />
      </label>

      {formError ? <p className="auth-error">{formError}</p> : null}

      <button className="auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving...' : 'Save transaction'}
      </button>
    </form>
  )
}
