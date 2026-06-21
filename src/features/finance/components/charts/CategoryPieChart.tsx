import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import type { Transaction } from '../../types/finance'
import { formatCurrency, getCategoryBreakdown } from '../../utils/financeChartData'

type CategoryPieChartProps = {
  transactions: Transaction[]
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const data = getCategoryBreakdown(transactions)

  return (
    <section className="finance-panel finance-chart-panel">
      <div>
        <span className="auth-eyebrow">Categories</span>
        <h2>Expense mix</h2>
        <p>See where spending is concentrated by category.</p>
      </div>

      {data.length ? (
        <>
          <ResponsiveContainer height={230} width="100%">
            <PieChart>
              <Pie data={data} dataKey="total" innerRadius={58} nameKey="category" outerRadius={92}>
                {data.map((item) => (
                  <Cell fill={item.color} key={item.category} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0b121d',
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  borderRadius: 10,
                }}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="finance-chart-legend">
            {data.map((item) => (
              <span key={item.category}>
                <i style={{ background: item.color }} />
                {item.category}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="finance-empty">Expense categories appear after you add spending.</p>
      )}
    </section>
  )
}
