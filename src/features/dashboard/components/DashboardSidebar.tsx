import { ChevronDown, MoreVertical } from 'lucide-react'

import { Avatar } from '../../../shared/components/Avatar'
import type { NavItem } from '../types/dashboard'

type DashboardSidebarProps = {
  navItems: NavItem[]
}

export function DashboardSidebar({ navItems }: DashboardSidebarProps) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <section className="brand">
        <div className="brand-mark">
          <svg viewBox="0 0 48 32" aria-hidden="true">
            <path d="M4 18 H12 L17 7 L25 27 L32 12 L37 18 H44" />
          </svg>
        </div>
        <div>
          <h1>LifeOS</h1>
          <p>Your life. Organized.</p>
        </div>
      </section>

      <nav className="nav-list">
        {navItems.map((item, index) => (
          <button
            className={item.active ? 'nav-item active' : 'nav-item'}
            key={item.label}
            type="button"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            {index === 8 ? <span className="nav-divider" /> : null}
          </button>
        ))}
      </nav>

      <section className="sync-card">
        <span className="status-dot" />
        <div>
          <strong>Offline Mode</strong>
          <p>All changes synced</p>
        </div>
        <MoreVertical size={18} />
      </section>

      <section className="profile-card">
        <Avatar />
        <div>
          <strong>Arjun Patel</strong>
          <p>arjun@example.com</p>
        </div>
        <ChevronDown size={16} />
      </section>
    </aside>
  )
}
