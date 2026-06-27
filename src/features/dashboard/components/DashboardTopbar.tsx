import { BarChart3, Bell, CalendarDays, ChevronDown, LogOut, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Avatar } from '../../../shared/components/Avatar'
import { useNotifications } from '../../../shared/hooks/useNotifications'
import { useAuth } from '../../auth/hooks/useAuth'
import { useUserProfile } from '../../settings/hooks/useUserProfile'
import { navItems } from '../data/dashboardData'

export function DashboardTopbar() {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { logout } = useAuth()
  const { data: profile } = useUserProfile()
  const { isEnabled, isRegistering, isSupported, permission, requestPermission } =
    useNotifications()
  const notificationLabel = isEnabled ? 'Notifications enabled' : 'Enable notifications'
  const today = new Date()
  const searchableItems = useMemo(() => navItems.filter((item) => item.path), [])
  const searchResults = query.trim()
    ? searchableItems.filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : []

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleShortcut)

    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  function goTo(path: string) {
    navigate(path)
    setQuery('')
    searchInputRef.current?.blur()
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const firstMatch = searchResults[0]

    if (firstMatch?.path) {
      goTo(firstMatch.path)
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true)
    const { error } = await logout()
    setIsLoggingOut(false)

    if (!error) {
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="topbar">
      <form className="search-box" onSubmit={handleSearchSubmit}>
        <Search size={18} />
        <input
          aria-label="Search pages"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search pages..."
          ref={searchInputRef}
          value={query}
        />
        <kbd>Ctrl</kbd>
        <kbd>K</kbd>
        {searchResults.length ? (
          <div className="search-results" role="listbox">
            {searchResults.map((item) => (
              <button key={item.label} onClick={() => item.path && goTo(item.path)} type="button">
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </form>

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
          title={
            isSupported ? notificationLabel : 'Notifications are not supported in this browser'
          }
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
          <Avatar
            alt={profile?.displayName || 'Profile picture'}
            compact
            src={profile?.avatarUrl}
          />
          <ChevronDown size={15} />
        </button>
        <button
          aria-label="Log out"
          className="logout-button"
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
          title="Log out"
          type="button"
        >
          <LogOut size={16} />
          <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
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
