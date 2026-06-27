import { BarChart3, Bell, CalendarDays, ChevronDown, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar } from '../../../shared/components/Avatar'
import { useNotifications } from '../../../shared/hooks/useNotifications'

export function DashboardTopbar() {
  const navigate = useNavigate()
  const { isEnabled, isRegistering, isSupported, permission, requestPermission } =
    useNotifications()
  const notificationLabel = isEnabled ? 'Notifications enabled' : 'Enable notifications'
  const today = new Date()

  return (
    <header className="topbar">
      <label className="search-box">
        <Search size={18} />
        <input aria-label="Search" placeholder="Search anything..." />
        <kbd>Ctrl</kbd>
        <kbd>K</kbd>
      </label>

      <div className="topbar-cluster">
        <button className="date-button" onClick={() => navigate('/calendar')} type="button">
          <CalendarDays size={20} />
          <span>
            <strong>
              {today.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                weekday: 'long',
                year: 'numeric',
              })}
            </strong>
            <small>Week {getWeekNumber(today)}</small>
          </span>
          <ChevronDown size={16} />
        </button>
        <button className="period-button" onClick={() => navigate('/insights')} type="button">
          <BarChart3 size={18} />
          This Week
          <ChevronDown size={16} />
        </button>
        <button
          aria-label={notificationLabel}
          className={isEnabled ? 'bell-button active' : 'bell-button'}
          disabled={!isSupported || isRegistering}
          onClick={() => void requestPermission()}
          title={isSupported ? notificationLabel : 'Notifications are not supported in this browser'}
          type="button"
        >
          <Bell size={20} />
          <span>{permission === 'granted' ? 'OK' : '!'}</span>
        </button>
        <button
          aria-label="Open settings"
          className="profile-button"
          onClick={() => navigate('/settings')}
          type="button"
        >
          <Avatar compact />
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  )
}

function getWeekNumber(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDays = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000)

  return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7)
}
