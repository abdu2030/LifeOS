import { MoreVertical } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type DashboardCardHeaderProps = {
  children?: ReactNode
  icon: LucideIcon
  label: string
  tone: string
}

export function DashboardCardHeader({
  children,
  icon: Icon,
  label,
  tone,
}: DashboardCardHeaderProps) {
  return (
    <header className="card-header">
      <div className="card-title">
        <span className={`card-icon ${tone}`}>
          <Icon size={17} />
        </span>
        <strong>{label}</strong>
      </div>
      <div className="card-actions">
        {children}
        <button className="icon-action" type="button" aria-label={`${label} options`}>
          <MoreVertical size={17} />
        </button>
      </div>
    </header>
  )
}
