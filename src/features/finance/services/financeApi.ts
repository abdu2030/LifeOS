import { supabase } from '../../../lib/supabase'
import type { Transaction, TransactionInput } from '../types/finance'

type FinanceRecordRow = {
  id: string
  user_id: string
  account_id: string | null
  record_type: Transaction['type']
  category: string
  amount: number | string
  description: string | null
  occurred_on: string
  created_at: string
}

function mapFinanceRecord(row: FinanceRecordRow): Transaction {
  return {
    accountId: row.account_id,
    amount: Number(row.amount),
    category: row.category,
    createdAt: row.created_at,
    description: row.description,
    id: row.id,
    occurredOn: row.occurred_on,
    type: row.record_type,
    userId: row.user_id,
  }
}

export async function listTransactions(userId: string) {
  const { data, error } = await supabase
    .from('finance_records')
    .select('id,user_id,account_id,record_type,category,amount,description,occurred_on,created_at')
    .eq('user_id', userId)
    .order('occurred_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => mapFinanceRecord(row as FinanceRecordRow))
}

export async function createTransaction(userId: string, input: TransactionInput) {
  const { data, error } = await supabase
    .from('finance_records')
    .insert({
      account_id: input.accountId ?? null,
      amount: input.amount,
      category: input.category,
      description: input.description || null,
      occurred_on: input.occurredOn,
      record_type: input.type,
      user_id: userId,
    })
    .select('id,user_id,account_id,record_type,category,amount,description,occurred_on,created_at')
    .single()

  if (error) {
    throw error
  }

  return mapFinanceRecord(data as FinanceRecordRow)
}

export async function deleteTransaction(transactionId: string) {
  const { error } = await supabase.from('finance_records').delete().eq('id', transactionId)

  if (error) {
    throw error
  }
}
