export type TransactionType = 'income' | 'expense' | 'transfer'

export type Transaction = {
  id: string
  userId: string
  accountId: string | null
  type: TransactionType
  category: string
  amount: number
  description: string | null
  occurredOn: string
  createdAt: string
}

export type TransactionInput = {
  accountId?: string | null
  amount: number
  category: string
  description?: string
  occurredOn: string
  type: TransactionType
}

export type FinanceCategory = {
  id: string
  name: string
  type: TransactionType
  color: string
}
