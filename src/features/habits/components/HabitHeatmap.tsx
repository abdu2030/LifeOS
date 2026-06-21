import * as d3 from 'd3'
import { useMemo, useState } from 'react'

import type { Habit } from '../types/habit'

type HabitHeatmapProps = {
  habits: Habit[]
}

type HeatmapCell = {
  count: number
  dateKey: string
  day: number
  habits: string[]
  week: number
}

type TooltipState = {
  cell: HeatmapCell
  x: number
  y: number
}

const cellSize = 12
const cellGap = 4
const weeksToShow = 52
const heatmapColors = ['rgba(148, 163, 184, 0.12)', '#0e4429', '#006d32', '#26a641', '#39d353']

export function HabitHeatmap({ habits }: HabitHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const cells = useMemo(() => buildHeatmapCells(habits), [habits])
  const maxCount = d3.max(cells, (cell) => cell.count) ?? 0
  const colorScale = d3
    .scaleQuantize<string>()
    .domain([1, Math.max(maxCount, 1)])
    .range(heatmapColors.slice(1))
  const width = weeksToShow * (cellSize + cellGap)
  const height = 7 * (cellSize + cellGap)
  const selectedHabits = selectedCell?.habits ?? []

  return (
    <section className="finance-panel habit-heatmap-panel">
      <div>
        <span className="auth-eyebrow">D3 Heatmap</span>
        <h2>Consistency map</h2>
        <p>Each square shows how many habits were completed on that day.</p>
      </div>

      <div className="habit-heatmap-scroll">
        <svg className="habit-d3-heatmap" role="img" viewBox={`0 0 ${width} ${height}`}>
          <title>Habit completion heatmap</title>
          {cells.map((cell) => (
            <rect
              className={
                selectedCell?.dateKey === cell.dateKey
                  ? 'habit-heatmap-cell selected'
                  : 'habit-heatmap-cell'
              }
              fill={cell.count ? colorScale(cell.count) : heatmapColors[0]}
              height={cellSize}
              key={cell.dateKey}
              onClick={() => setSelectedCell(cell)}
              onMouseEnter={(event) =>
                setTooltip({
                  cell,
                  x: event.clientX,
                  y: event.clientY,
                })
              }
              onMouseLeave={() => setTooltip(null)}
              onMouseMove={(event) =>
                setTooltip({
                  cell,
                  x: event.clientX,
                  y: event.clientY,
                })
              }
              rx={3}
              stroke="rgba(255, 255, 255, 0.04)"
              tabIndex={0}
              width={cellSize}
              x={cell.week * (cellSize + cellGap)}
              y={cell.day * (cellSize + cellGap)}
            />
          ))}
        </svg>
      </div>

      {tooltip ? (
        <div
          className="habit-heatmap-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <strong>{tooltip.cell.dateKey}</strong>
          <span>{tooltip.cell.count} completed</span>
        </div>
      ) : null}

      {selectedCell ? (
        <div className="habit-heatmap-detail">
          <strong>{selectedCell.dateKey}</strong>
          {selectedHabits.length ? (
            <div>
              {selectedHabits.map((habitName) => (
                <span key={habitName}>{habitName}</span>
              ))}
            </div>
          ) : (
            <p>No habits completed on this day.</p>
          )}
        </div>
      ) : null}
    </section>
  )
}

function buildHeatmapCells(habits: Habit[]): HeatmapCell[] {
  const completedByDate = new Map<string, number>()
  const habitNamesByDate = new Map<string, string[]>()

  habits.forEach((habit) => {
    habit.logs.forEach((log) => {
      if (log.count <= 0) {
        return
      }

      completedByDate.set(log.loggedOn, (completedByDate.get(log.loggedOn) ?? 0) + 1)
      habitNamesByDate.set(log.loggedOn, [
        ...(habitNamesByDate.get(log.loggedOn) ?? []),
        habit.name,
      ])
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
      habits: habitNamesByDate.get(dateKey) ?? [],
      week: Math.floor(index / 7),
    }
  })
}
