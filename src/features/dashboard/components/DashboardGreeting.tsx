import { SlidersHorizontal } from 'lucide-react'

export function DashboardGreeting() {
  return (
    <section className="greeting-row">
      <div>
        <h2>Good morning, Arjun! <span aria-hidden="true">{'\u{1F44B}'}</span></h2>
        <p>Here's what's happening in your life today.</p>
      </div>
      <button className="customize-button" type="button">
        <SlidersHorizontal size={18} />
        Customize Dashboard
      </button>
    </section>
  )
}
