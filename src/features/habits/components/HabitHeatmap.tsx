import * as d3 from 'd3'
import { useMemo } from 'react'

import type { Habit } from '../types/habit'

type HabitHeatmapProps = {
  habits: Habit[]
}

type HeatmapCell = {
  count: number
  dateKey: string
  day: number
  week: number
}

const cellSize = 14
const cellGap = 5
const weeksToShow = 13

export function HabitHeatmap({ habits }: HabitHeatmapProps) {
  const cells = useMemo(() => buildHeatmapCells(habits), [habits])
  const maxCount = d3.max(cells, (cell) => cell.count) ?? 0
  const colorScale = d3.scaleSequential([0, Math.max(maxCount, 1)], d3.interpolateYlGnBu)
  const width = weeksToShow * (cellSize + cellGap)
  const height = 7 * (cellSize + cellGap)

  return (
    <section className="finance-panel habit-heatmap-panel">
      <div>
        <span className="auth-eyebrow">D3 Heatmap</span>
        <h2>Consistency map</h2>
        <p>Each square shows how many habits were completed on that day.</p>
      </div>

      <svg className="habit-d3-heatmap" role="img" viewBox={`0 0 ${width} ${height}`}>
        <title>Habit completion heatmap</title>
        {cells.map((cell) => (
          <rect
            fill={cell.count ? colorScale(cell.count) : 'rgba(148, 163, 184, 0.12)'}
            height={cellSize}
            key={cell.dateKey}
            rx={4}
            width={cellSize}
            x={cell.week * (cellSize + cellGap)}
            y={cell.day * (cellSize + cellGap)}
          >
            <title>
              {cell.dateKey}: {cell.count} completed
            </title>
          </rect>
        ))}
      </svg>
    </section>
  )
}

function buildHeatmapCells(habits: Habit[]): HeatmapCell[] {
  const completedByDate = new Map<string, number>()

  habits.forEach((habit) => {
    habit.logs.forEach((log) => {
      if (log.count <= 0) {
        return
      }

      completedByDate.set(log.loggedOn, (completedByDate.get(log.loggedOn) ?? 0) + 1)
    })
  })

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - weeksToShow * 7 + 1)

  return Array.from({ length: weeksToShow * 7 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    const dateKey = date.toISOString().slice(0, 10)

    return {
      count: completedByDate.get(dateKey) ?? 0,
      dateKey,
      day: index % 7,
      week: Math.floor(index / 7),
    }
  })
}
