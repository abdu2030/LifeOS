import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { getDefaultWidgetLayouts } from '../registry/widgetRegistry'
import { getWidgetLayouts, saveWidgetLayouts } from '../services/widgetLayoutService'
import type { PersistedWidgetLayout, WidgetLayoutItem } from '../types/widget'

export function useWidgetLayouts() {
  const { user } = useAuth()
  const defaultLayouts = useMemo(() => getDefaultWidgetLayouts(), [])
  const [layouts, setLayouts] = useState<WidgetLayoutItem[]>(defaultLayouts)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    let isMounted = true

    getWidgetLayouts(user.id)
      .then((savedLayouts) => {
        if (!isMounted || !savedLayouts?.length) {
          return
        }

        setLayouts(savedLayouts)
      })
      .catch((layoutError: Error) => {
        if (isMounted) {
          setError(layoutError.message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [defaultLayouts, user])

  async function updateLayouts(nextLayouts: WidgetLayoutItem[]) {
    setLayouts(nextLayouts)

    if (!user) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await saveWidgetLayouts(user.id, nextLayouts as PersistedWidgetLayout[])
    } catch (layoutError) {
      setError(layoutError instanceof Error ? layoutError.message : 'Unable to save layout')
    } finally {
      setIsSaving(false)
    }
  }

  function resetLayouts() {
    void updateLayouts(defaultLayouts)
  }

  return {
    error,
    isSaving,
    layouts,
    resetLayouts,
    updateLayouts,
  }
}
