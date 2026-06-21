import { ChevronDown, MoreVertical } from 'lucide-react'
import { NavLink } from 'react-router-dom'

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
          <NavEntry item={item} key={item.label} showDivider={index === 8} />
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

type NavEntryProps = {
  item: NavItem
  showDivider: boolean
}

function NavEntry({ item, showDivider }: NavEntryProps) {
  const content = (
    <>
      <item.icon size={20} />
      <span>{item.label}</span>
      {showDivider ? <span className="nav-divider" /> : null}
    </>
  )

  if (item.path) {
    return (
      <NavLink
        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        to={item.path}
      >
        {content}
      </NavLink>
    )
  }

  return (
    <button className="nav-item disabled" disabled type="button">
      {content}
    </button>
  )
}
