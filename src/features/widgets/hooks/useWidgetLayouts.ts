import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { getDefaultWidgetLayouts } from '../registry/widgetRegistry'
import {
  getLocalWidgetLayouts,
  getWidgetLayouts,
  saveLocalWidgetLayouts,
  saveWidgetLayouts,
} from '../services/widgetLayoutService'
import type { PersistedWidgetLayout, WidgetLayoutItem } from '../types/widget'

export function useWidgetLayouts() {
  const { user } = useAuth()
  const defaultLayouts = useMemo(() => getDefaultWidgetLayouts(), [])
  const [layouts, setLayouts] = useState<WidgetLayoutItem[]>(() => cloneLayouts(defaultLayouts))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    let isMounted = true

    void Promise.resolve()
      .then(() => getLocalWidgetLayouts(user.id))
      .then((localLayouts) => {
        if (isMounted && localLayouts?.length) {
          setLayouts(cloneLayouts(localLayouts))
        }
      })

    getWidgetLayouts(user.id)
      .then((savedLayouts) => {
        if (!isMounted || !savedLayouts?.length) {
          return
        }

        setLayouts(cloneLayouts(savedLayouts))
      })
      .catch(() => {
        if (isMounted) {
          setError(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [defaultLayouts, user])

  async function updateLayouts(nextLayouts: WidgetLayoutItem[]) {
    const persistedLayouts = cloneLayouts(nextLayouts) as PersistedWidgetLayout[]

    setLayouts(persistedLayouts)

    if (!user) {
      return
    }

    saveLocalWidgetLayouts(user.id, persistedLayouts)
    setIsSaving(true)
    setError(null)

    try {
      await saveWidgetLayouts(user.id, persistedLayouts)
    } catch {
      setError(null)
    } finally {
      setIsSaving(false)
    }
  }

  function resetLayouts() {
    void updateLayouts(cloneLayouts(defaultLayouts))
  }

  return {
    error,
    isSaving,
    layouts,
    resetLayouts,
    updateLayouts,
  }
}

function cloneLayouts(layouts: WidgetLayoutItem[]) {
  return layouts.map((layout) => ({ ...layout }))
}
