import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { Transaction } from '../../types/finance'
import { formatCurrency, getTransactionTypeTotals } from '../../utils/financeChartData'

type TransactionTypeBarChartProps = {
  transactions: Transaction[]
}

export function TransactionTypeBarChart({ transactions }: TransactionTypeBarChartProps) {
  const data = getTransactionTypeTotals(transactions)
  const hasData = data.some((item) => item.total > 0)

  return (
    <section className="finance-panel finance-chart-panel">
      <div>
        <span className="auth-eyebrow">Totals</span>
        <h2>Money by type</h2>
        <p>Compare income, expenses, and transfers at a glance.</p>
      </div>

      {hasData ? (
        <ResponsiveContainer height={240} width="100%">
          <BarChart data={data} margin={{ bottom: 6, left: 0, right: 8, top: 8 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis dataKey="type" stroke="#94a3b8" tickLine={false} />
            <YAxis stroke="#94a3b8" tickFormatter={formatCurrency} tickLine={false} width={72} />
            <Tooltip
              contentStyle={{
                background: '#0b121d',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                borderRadius: 10,
              }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Bar dataKey="total" fill="#3777ff" name="Total" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="finance-empty">Totals appear once transactions are available.</p>
      )}
    </section>
  )
}
