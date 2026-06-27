import { SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type DashboardGreetingProps = {
  displayName: string
  isLoading?: boolean
}

export function DashboardGreeting({ displayName, isLoading = false }: DashboardGreetingProps) {
  const navigate = useNavigate()

  return (
    <section className="greeting-row">
      <div>
        <h2>
          {getGreeting()}, {isLoading ? 'loading your space' : displayName}!{' '}
          <span aria-hidden="true">{'\u{1F44B}'}</span>
        </h2>
        <p>Here&apos;s what your real LifeOS data says today.</p>
      </div>
      <button className="customize-button" onClick={() => navigate('/widgets')} type="button">
        <SlidersHorizontal size={18} />
        Customize Dashboard
      </button>
    </section>
  )
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
