import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { Transaction } from '../../types/finance'
import { formatCurrency, getCashflowSeries } from '../../utils/financeChartData'

type CashflowLineChartProps = {
  transactions: Transaction[]
}

export function CashflowLineChart({ transactions }: CashflowLineChartProps) {
  const data = getCashflowSeries(transactions)

  return (
    <section className="finance-panel finance-chart-panel">
      <div>
        <span className="auth-eyebrow">Cashflow</span>
        <h2>Income vs expenses</h2>
        <p>Monthly money movement from your recorded transactions.</p>
      </div>

      {data.length ? (
        <ResponsiveContainer height={260} width="100%">
          <LineChart data={data} margin={{ bottom: 6, left: 0, right: 8, top: 8 }}>
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
            <Line dataKey="income" name="Income" stroke="#21d07a" strokeWidth={3} type="monotone" />
            <Line
              dataKey="expense"
              name="Expenses"
              stroke="#ff4d6d"
              strokeWidth={3}
              type="monotone"
            />
            <Line dataKey="net" name="Net" stroke="#3777ff" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="finance-empty">Add transactions to unlock the cashflow chart.</p>
      )}
    </section>
  )
}
