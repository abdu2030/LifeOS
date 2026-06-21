import { GoalForm } from '../components/GoalForm'
import { GoalList } from '../components/GoalList'
import { useGoals } from '../hooks/useGoals'

export function GoalsPage() {
  const {
    createGoal,
    deleteGoal,
    error,
    goals,
    isCreating,
    isDeleting,
    isLoading,
    isUpdating,
    updateGoal,
  } = useGoals()

  return (
    <section className="goals-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Goals</span>
          <h2>Turn ambition into a map</h2>
          <p>Build parent goals, milestones, and progress signals around the life you are designing.</p>
        </div>
      </div>

      <div className="goals-layout-grid">
        <GoalForm goals={goals} isSubmitting={isCreating} onSubmit={createGoal} />
        <GoalList
          error={error}
          goals={goals}
          isDeleting={isDeleting}
          isLoading={isLoading}
          isUpdating={isUpdating}
          onDelete={deleteGoal}
          onUpdate={(goalId, input) => updateGoal({ goalId, input })}
        />
      </div>
    </section>
  )
}
