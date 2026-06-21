import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { Transaction } from '../../types/finance'
import { formatCurrency, getDailySpendingSeries } from '../../utils/financeChartData'

type DailySpendingBarChartProps = {
  transactions: Transaction[]
}

export function DailySpendingBarChart({ transactions }: DailySpendingBarChartProps) {
  const data = getDailySpendingSeries(transactions)

  return (
    <section className="finance-panel finance-chart-panel">
      <div>
        <span className="auth-eyebrow">Spending</span>
        <h2>Daily expenses</h2>
        <p>Last recorded spending days from imported or manual entries.</p>
      </div>

      {data.length ? (
        <ResponsiveContainer height={240} width="100%">
          <BarChart data={data} margin={{ bottom: 6, left: 0, right: 8, top: 8 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} />
            <YAxis stroke="#94a3b8" tickFormatter={formatCurrency} tickLine={false} width={72} />
            <Tooltip
              contentStyle={{
                background: '#0b121d',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                borderRadius: 10,
              }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Bar dataKey="expense" fill="#f8a831" name="Expenses" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="finance-empty">Daily spending bars appear after expenses are saved.</p>
      )}
    </section>
  )
}
