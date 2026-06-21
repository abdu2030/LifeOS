import type { FinanceCategory } from '../types/finance'

export const defaultFinanceCategories: FinanceCategory[] = [
  { id: 'salary', name: 'Salary', type: 'income', color: '#21d07a' },
  { id: 'freelance', name: 'Freelance', type: 'income', color: '#38bdf8' },
  { id: 'food', name: 'Food & Dining', type: 'expense', color: '#f8a831' },
  { id: 'transport', name: 'Transportation', type: 'expense', color: '#3777ff' },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: '#7c3cff' },
  { id: 'utilities', name: 'Bills & Utilities', type: 'expense', color: '#ff4d6d' },
]
