import { useMemo, useState } from 'react'

import { GoalForm } from '../components/GoalForm'
import { GoalDetailPanel } from '../components/GoalDetailPanel'
import { GoalList } from '../components/GoalList'
import { GoalTreeView } from '../components/GoalTreeView'
import { useGoals } from '../hooks/useGoals'
import { useHabits } from '../../habits/hooks/useHabits'

export function GoalsPage() {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const { habits } = useHabits()
  const {
    createMilestone,
    createGoal,
    deleteGoal,
    deleteMilestone,
    error,
    goalTree,
    goals,
    habitLinks,
    isCreating,
    isDeleting,
    isLoading,
    isUpdating,
    linkHabit,
    milestones,
    progressByGoalId,
    toggleMilestone,
    unlinkHabit,
    updateGoal,
  } = useGoals()
  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.id === selectedGoalId) ?? goals[0] ?? null,
    [goals, selectedGoalId],
  )
  const activeGoalId = selectedGoal?.id ?? null
  const selectedMilestones = milestones.filter((milestone) => milestone.goalId === activeGoalId)
  const selectedHabitLinks = habitLinks.filter((link) => link.goalId === activeGoalId)

  return (
    <section className="goals-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Goals</span>
          <h2>Turn ambition into a map</h2>
          <p>Build parent goals, milestones, and progress signals around the life you are designing.</p>
        </div>
      </div>

      <GoalTreeView goals={goalTree} onSelectGoal={setSelectedGoalId} selectedGoalId={activeGoalId} />

      <GoalDetailPanel
        goal={selectedGoal}
        habitLinks={selectedHabitLinks}
        habits={habits}
        isUpdating={isUpdating}
        milestones={selectedMilestones}
        onCreateMilestone={createMilestone}
        onDeleteMilestone={deleteMilestone}
        onLinkHabit={linkHabit}
        onToggleMilestone={toggleMilestone}
        onUnlinkHabit={unlinkHabit}
        progressScore={activeGoalId ? progressByGoalId[activeGoalId] : null}
      />

      <div className="goals-layout-grid">
        <GoalForm goals={goals} isSubmitting={isCreating} onSubmit={createGoal} />
        <GoalList
          error={error}
          goals={goals}
          isDeleting={isDeleting}
          isLoading={isLoading}
          isUpdating={isUpdating}
          onDelete={deleteGoal}
          onSelect={setSelectedGoalId}
          onUpdate={(goalId, input) => updateGoal({ goalId, input })}
          selectedGoalId={activeGoalId}
        />
      </div>
    </section>
  )
}
