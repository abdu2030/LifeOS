import { useState } from 'react'

import { Bell, Download, Palette, Shield, UserRound } from 'lucide-react'

import { useNotifications } from '../../../shared/hooks/useNotifications'
import { useThemeStore, type ThemeName } from '../../../stores/themeStore'
import { useSettings } from '../hooks/useSettings'
import type { DataExportBundle } from '../types/settings'

const themes: Array<{ description: string; label: string; value: ThemeName }> = [
  { description: 'Deep navy panels and calm blue accents.', label: 'Dark', value: 'dark' },
  { description: 'Clean daylight workspace with crisp contrast.', label: 'Light', value: 'light' },
  { description: 'Electric purple and neon productivity glow.', label: 'Cyberpunk', value: 'cyberpunk' },
  { description: 'Soft greens for a grounded planning space.', label: 'Forest', value: 'forest' },
]

export function SettingsPage() {
  const { exportData, isExporting, isLoading, isSavingProfile, profile, profileError, updateProfile, user } =
    useSettings()
  const { isEnabled, isRegistering, isSupported, permission, requestPermission } = useNotifications()
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  async function handleExport() {
    const bundle = await exportData()
    downloadJson(bundle)
  }

  return (
    <section className="settings-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Settings</span>
          <h2>Personalize LifeOS</h2>
          <p>Manage your profile, themes, notifications, privacy posture, and data export.</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="finance-panel settings-panel">
          <PanelHeading icon={UserRound} eyebrow="Profile" title="Workspace identity" />
          {isLoading ? <p className="finance-empty">Loading profile...</p> : null}
          {profileError ? <p className="auth-error">{profileError.message}</p> : null}
          <ProfileForm
            defaultDisplayName={profile?.displayName || user?.email || ''}
            defaultTimezone={profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
            isSaving={isSavingProfile}
            key={`${profile?.id ?? user?.id}-${profile?.displayName ?? ''}-${profile?.timezone ?? ''}`}
            onSubmit={updateProfile}
          />
        </section>

        <section className="finance-panel settings-panel">
          <PanelHeading icon={Palette} eyebrow="Theme" title="Choose your visual mode" />
          <div className="theme-picker">
            {themes.map((themeOption) => (
              <button
                className={theme === themeOption.value ? 'theme-option active' : 'theme-option'}
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                type="button"
              >
                <span className={`theme-swatch theme-swatch--${themeOption.value}`} />
                <strong>{themeOption.label}</strong>
                <small>{themeOption.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="finance-panel settings-panel">
          <PanelHeading icon={Bell} eyebrow="Notifications" title="Reminder permissions" />
          <p>
            Browser notifications are used for habit reminders, sync confirmations, and future planner
            alerts.
          </p>
          <div className="settings-status-row">
            <span>{isSupported ? 'Supported on this browser' : 'Not supported on this browser'}</span>
            <strong>{isEnabled ? 'Enabled' : permission}</strong>
          </div>
          <button
            className="auth-submit"
            disabled={!isSupported || isRegistering}
            onClick={() => requestPermission()}
            type="button"
          >
            {isRegistering ? 'Requesting...' : 'Enable notifications'}
          </button>
        </section>

        <section className="finance-panel settings-panel">
          <PanelHeading icon={Shield} eyebrow="Privacy" title="Private by design" />
          <div className="privacy-list">
            <span>Journal encryption stays in the browser before saving.</span>
            <span>Supabase row-level security keeps each user scoped to their own records.</span>
            <span>AI features only run when you explicitly click analysis or report generation.</span>
          </div>
        </section>

        <section className="finance-panel settings-panel settings-panel-wide">
          <PanelHeading icon={Download} eyebrow="Data Export" title="Download your workspace" />
          <p>Export your profile, finance records, habits, journal entries, goals, calendar events, and weekly reports as JSON.</p>
          <button className="auth-submit" disabled={isExporting} onClick={handleExport} type="button">
            {isExporting ? 'Preparing export...' : 'Download JSON export'}
          </button>
        </section>
      </div>
    </section>
  )
}

function ProfileForm({
  defaultDisplayName,
  defaultTimezone,
  isSaving,
  onSubmit,
}: {
  defaultDisplayName: string
  defaultTimezone: string
  isSaving: boolean
  onSubmit: (input: { displayName: string; timezone: string }) => Promise<unknown>
}) {
  const [displayName, setDisplayName] = useState(defaultDisplayName)
  const [formMessage, setFormMessage] = useState('')
  const [timezone, setTimezone] = useState(defaultTimezone)

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('')

    await onSubmit({ displayName, timezone })
    setFormMessage('Profile saved.')
  }

  return (
    <form className="settings-form" onSubmit={handleProfileSubmit}>
      <label className="auth-field">
        Display name
        <input
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Your name"
          type="text"
          value={displayName}
        />
      </label>
      <label className="auth-field">
        Timezone
        <input
          onChange={(event) => setTimezone(event.target.value)}
          placeholder="Africa/Nairobi"
          type="text"
          value={timezone}
        />
      </label>
      {formMessage ? <p className="settings-success">{formMessage}</p> : null}
      <button className="auth-submit" disabled={isSaving} type="submit">
        {isSaving ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  )
}

function PanelHeading({
  eyebrow,
  icon: Icon,
  title,
}: {
  eyebrow: string
  icon: React.ComponentType<{ size?: number }>
  title: string
}) {
  return (
    <div className="settings-panel-heading">
      <Icon size={20} />
      <div>
        <span className="auth-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
    </div>
  )
}

function downloadJson(bundle: DataExportBundle) {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `lifeos-export-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}
