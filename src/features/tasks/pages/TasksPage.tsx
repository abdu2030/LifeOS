import { Check, Clock, ListTodo } from 'lucide-react'

import { getTodayFocusTasks } from '../services/taskService'

export function TasksPage() {
  const tasks = getTodayFocusTasks()
  const completedCount = tasks.filter((task) => task.done).length

  return (
    <section className="tasks-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Tasks</span>
          <h2>Today&apos;s focus</h2>
          <p>Track the priority items currently powering your dashboard focus card.</p>
        </div>
        <div className="task-progress-summary">
          <ListTodo size={18} />
          <strong>
            {completedCount}/{tasks.length}
          </strong>
          <span>complete</span>
        </div>
      </div>

      <section className="finance-panel task-page-panel">
        <div className="task-list">
          {tasks.map((task) => (
            <div className={task.done ? 'task-row done' : 'task-row'} key={task.label}>
              <span className={task.done ? 'checkbox checked' : 'checkbox'}>
                {task.done ? <Check size={13} /> : null}
              </span>
              <span className="task-copy">
                <strong>{task.label}</strong>
                <small>
                  <Clock size={12} /> {task.time}
                </small>
              </span>
              <b className={`task-tag ${task.tag.toLowerCase()}`}>{task.tag}</b>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
