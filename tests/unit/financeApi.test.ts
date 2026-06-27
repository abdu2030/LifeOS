import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TransactionInput } from '../../src/features/finance/types/finance'

const fromMock = vi.fn()

vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: fromMock,
  },
}))

const { createTransaction, deleteTransaction, listTransactions } = await import(
  '../../src/features/finance/services/financeApi'
)

describe('financeApi', () => {
  beforeEach(() => {
    fromMock.mockReset()
  })

  it('lists transactions from Supabase and maps database rows to app types', async () => {
    const secondOrderMock = vi.fn().mockResolvedValue({
      data: [
        {
          account_id: null,
          amount: '42.50',
          category: 'Food',
          created_at: '2026-06-27T08:00:00.000Z',
          description: 'Lunch',
          id: 'record-1',
          occurred_on: '2026-06-27',
          record_type: 'expense',
          user_id: 'user-1',
        },
      ],
      error: null,
    })
    const firstOrderMock = vi.fn().mockReturnValue({ order: secondOrderMock })
    const eqMock = vi.fn().mockReturnValue({ order: firstOrderMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

    fromMock.mockReturnValue({ select: selectMock })

    await expect(listTransactions('user-1')).resolves.toEqual([
      {
        accountId: null,
        amount: 42.5,
        category: 'Food',
        createdAt: '2026-06-27T08:00:00.000Z',
        description: 'Lunch',
        id: 'record-1',
        occurredOn: '2026-06-27',
        type: 'expense',
        userId: 'user-1',
      },
    ])
    expect(fromMock).toHaveBeenCalledWith('finance_records')
    expect(eqMock).toHaveBeenCalledWith('user_id', 'user-1')
    expect(firstOrderMock).toHaveBeenCalledWith('occurred_on', { ascending: false })
    expect(secondOrderMock).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('creates a transaction with the Supabase column shape', async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: {
        account_id: 'cash',
        amount: 1200,
        category: 'Salary',
        created_at: '2026-06-27T09:00:00.000Z',
        description: null,
        id: 'record-2',
        occurred_on: '2026-06-27',
        record_type: 'income',
        user_id: 'user-1',
      },
      error: null,
    })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertMock = vi.fn().mockReturnValue({ select: selectMock })

    fromMock.mockReturnValue({ insert: insertMock })

    const input: TransactionInput = {
      accountId: 'cash',
      amount: 1200,
      category: 'Salary',
      occurredOn: '2026-06-27',
      type: 'income',
    }

    await expect(createTransaction('user-1', input)).resolves.toMatchObject({
      accountId: 'cash',
      amount: 1200,
      category: 'Salary',
      description: null,
      type: 'income',
    })
    expect(insertMock).toHaveBeenCalledWith({
      account_id: 'cash',
      amount: 1200,
      category: 'Salary',
      description: null,
      occurred_on: '2026-06-27',
      record_type: 'income',
      user_id: 'user-1',
    })
  })

  it('deletes transactions by id and throws Supabase errors', async () => {
    const supabaseError = new Error('delete failed')
    const eqMock = vi.fn().mockResolvedValue({ error: supabaseError })
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })

    fromMock.mockReturnValue({ delete: deleteMock })

    await expect(deleteTransaction('record-1')).rejects.toThrow('delete failed')
    expect(fromMock).toHaveBeenCalledWith('finance_records')
    expect(eqMock).toHaveBeenCalledWith('id', 'record-1')
  })
})
