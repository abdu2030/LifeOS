import { ChevronDown, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useOfflineStatus } from '../../offline/hooks/useOfflineStatus'
import { useAuth } from '../../auth/hooks/useAuth'
import { useUserProfile } from '../../settings/hooks/useUserProfile'
import { Avatar } from '../../../shared/components/Avatar'
import type { NavItem } from '../types/dashboard'

type DashboardSidebarProps = {
  navItems: NavItem[]
}

export function DashboardSidebar({ navItems }: DashboardSidebarProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { data: profile } = useUserProfile()
  const { isOnline, pendingCount, syncMessage } = useOfflineStatus()
  const displayName = profile?.displayName || getDisplayName(user?.email, user?.user_metadata)

  async function handleLogout() {
    setIsLoggingOut(true)
    const { error } = await logout()
    setIsLoggingOut(false)

    if (!error) {
      navigate('/login', { replace: true })
    }
  }

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
        <span className={isOnline ? 'status-dot' : 'status-dot offline'} />
        <div>
          <strong>{isOnline ? 'Online Sync' : 'Offline Mode'}</strong>
          <p>{pendingCount ? `${pendingCount} queued · ${syncMessage}` : syncMessage}</p>
        </div>
        <MoreVertical size={18} />
      </section>

      <section className="profile-card">
        <Avatar alt={displayName} src={profile?.avatarUrl} />
        <div>
          <strong>{displayName}</strong>
          <p>{user?.email ?? 'Signed in'}</p>
        </div>
        <button
          className="profile-logout-button"
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
          type="button"
        >
          {isLoggingOut ? 'Leaving...' : 'Log out'}
        </button>
        <ChevronDown size={16} />
      </section>
    </aside>
  )
}

function getDisplayName(email?: string, metadata?: Record<string, unknown>) {
  const name = metadata?.full_name || metadata?.name || metadata?.display_name

  if (typeof name === 'string' && name.trim()) {
    return name
  }

  return email ? email.split('@')[0]?.replace(/[._-]+/g, ' ') : 'LifeOS user'
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
