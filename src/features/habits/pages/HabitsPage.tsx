import { HabitForm } from '../components/HabitForm'
import { HabitList } from '../components/HabitList'
import { useHabits } from '../hooks/useHabits'

export function HabitsPage() {
  const {
    createHabit,
    error,
    habits,
    isCreating,
    isLoading,
    isUpdating,
    todayKey,
    toggleCompletion,
    useFreeze,
  } = useHabits()

  return (
    <section className="habits-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Habits</span>
          <h2>Make consistency visible</h2>
          <p>Track daily check-ins, streaks, and freeze tokens from one focused workspace.</p>
        </div>
      </div>

      <div className="habits-layout-grid">
        <HabitForm isSubmitting={isCreating} onSubmit={createHabit} />
        <HabitList
          error={error}
          habits={habits}
          isLoading={isLoading}
          isUpdating={isUpdating}
          onFreeze={useFreeze}
          onToggle={(habitId, completed) => toggleCompletion({ completed, habitId })}
          todayKey={todayKey}
        />
      </div>
    </section>
  )
}
