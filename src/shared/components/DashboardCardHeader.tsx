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
      {children ? <div className="card-actions">{children}</div> : null}
    </header>
  )
}
