import type { Habit } from '../../habits/types/habit'
import { GoalHabitLinker } from './GoalHabitLinker'
import { MilestoneList } from './MilestoneList'
import type { Goal, GoalHabitLink, GoalMilestone, GoalMilestoneInput } from '../types/goal'

type GoalDetailPanelProps = {
  goal: Goal | null
  habitLinks: GoalHabitLink[]
  habits: Habit[]
  isUpdating: boolean
  milestones: GoalMilestone[]
  progressScore: number | null
  onCreateMilestone: (input: GoalMilestoneInput) => Promise<unknown>
  onDeleteMilestone: (milestone: GoalMilestone) => Promise<unknown>
  onLinkHabit: (input: { goalId: string; habitId: string }) => Promise<unknown>
  onToggleMilestone: (milestone: GoalMilestone) => Promise<unknown>
  onUnlinkHabit: (linkId: string) => Promise<unknown>
}

export function GoalDetailPanel({
  goal,
  habitLinks,
  habits,
  isUpdating,
  milestones,
  progressScore,
  onCreateMilestone,
  onDeleteMilestone,
  onLinkHabit,
  onToggleMilestone,
  onUnlinkHabit,
}: GoalDetailPanelProps) {
  if (!goal) {
    return (
      <section className="finance-panel goal-detail-panel goal-detail-empty">
        <span className="auth-eyebrow">Goal Detail</span>
        <h2>Select a goal</h2>
        <p>Choose a row or tree node to manage milestones, supporting habits, and calculated progress.</p>
      </section>
    )
  }

  const completedMilestones = milestones.filter((milestone) => milestone.completed).length

  return (
    <section className="finance-panel goal-detail-panel">
      <div className="goal-detail-hero">
        <div>
          <span className="auth-eyebrow">Goal Detail</span>
          <h2>{goal.title}</h2>
          <p>{goal.description || 'No description added.'}</p>
        </div>
        <div className="goal-detail-score">
          <strong>{progressScore ?? goal.progress}%</strong>
          <span>{progressScore === null ? 'Manual progress' : 'Auto progress'}</span>
        </div>
      </div>

      <div className="goal-detail-metrics">
        <span>{formatStatus(goal.status)}</span>
        <span>
          {completedMilestones}/{milestones.length || 0} milestones
        </span>
        <span>{habitLinks.length} linked habits</span>
      </div>

      <MilestoneList
        goalId={goal.id}
        isUpdating={isUpdating}
        milestones={milestones}
        onCreate={onCreateMilestone}
        onDelete={onDeleteMilestone}
        onToggle={onToggleMilestone}
      />

      <GoalHabitLinker
        goalId={goal.id}
        habits={habits}
        isUpdating={isUpdating}
        links={habitLinks}
        onLink={onLinkHabit}
        onUnlink={onUnlinkHabit}
      />
    </section>
  )
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ')
}
