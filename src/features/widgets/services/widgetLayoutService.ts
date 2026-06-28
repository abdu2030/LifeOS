import { supabase } from '../../../lib/supabase'
import type { PersistedWidgetLayout } from '../types/widget'

const layoutKey = 'dashboard'
const localStoragePrefix = 'lifeos.widget-layouts'

type WidgetLayoutRow = {
  widgets: PersistedWidgetLayout[]
}

export function getLocalWidgetLayouts(userId: string) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.localStorage.getItem(getLocalStorageKey(userId))

    if (!value) {
      return null
    }

    const parsed = JSON.parse(value)

    return Array.isArray(parsed) ? (parsed as PersistedWidgetLayout[]) : null
  } catch {
    return null
  }
}

export function saveLocalWidgetLayouts(userId: string, widgets: PersistedWidgetLayout[]) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(widgets))
  } catch {
    // Local persistence is a convenience fallback; the in-memory layout still updates.
  }
}

export async function getWidgetLayouts(userId: string) {
  const { data, error } = await supabase
    .from('widget_layouts')
    .select('widgets')
    .eq('user_id', userId)
    .eq('layout_key', layoutKey)
    .maybeSingle<WidgetLayoutRow>()

  if (error) {
    throw error
  }

  return data?.widgets ?? null
}

export async function saveWidgetLayouts(userId: string, widgets: PersistedWidgetLayout[]) {
  const { error } = await supabase.from('widget_layouts').upsert(
    {
      layout_key: layoutKey,
      user_id: userId,
      widgets,
    },
    {
      onConflict: 'user_id,layout_key',
    },
  )

  if (error) {
    throw error
  }
}

function getLocalStorageKey(userId: string) {
  return `${localStoragePrefix}.${userId}.${layoutKey}`
}
