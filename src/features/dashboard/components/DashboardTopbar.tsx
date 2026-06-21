import { BarChart3, Bell, CalendarDays, ChevronDown, Search } from 'lucide-react'

import { Avatar } from '../../../shared/components/Avatar'
import { useNotifications } from '../../../shared/hooks/useNotifications'

export function DashboardTopbar() {
  const { isEnabled, isRegistering, isSupported, permission, requestPermission } =
    useNotifications()
  const notificationLabel = isEnabled ? 'Notifications enabled' : 'Enable notifications'

  return (
    <header className="topbar">
      <label className="search-box">
        <Search size={18} />
        <input aria-label="Search" placeholder="Search anything..." />
        <kbd>{'\u2318'}</kbd>
        <kbd>K</kbd>
      </label>

      <div className="topbar-cluster">
        <button className="date-button" type="button">
          <CalendarDays size={20} />
          <span>
            <strong>Saturday, May 24, 2026</strong>
            <small>Week 21</small>
          </span>
          <ChevronDown size={16} />
        </button>
        <button className="period-button" type="button">
          <BarChart3 size={18} />
          This Week
          <ChevronDown size={16} />
        </button>
        <button
          className={isEnabled ? 'bell-button active' : 'bell-button'}
          disabled={!isSupported || isRegistering}
          onClick={() => void requestPermission()}
          title={
            isSupported ? notificationLabel : 'Notifications are not supported in this browser'
          }
          type="button"
          aria-label={notificationLabel}
        >
          <Bell size={20} />
          <span>{permission === 'granted' ? '✓' : '!'}</span>
        </button>
        <button className="profile-button" type="button" aria-label="Open profile menu">
          <Avatar compact />
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  )
}
