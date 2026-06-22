import { useContext } from 'react'

import { OfflineContext } from '../contexts/OfflineContext'

export function useOfflineStatus() {
  const context = useContext(OfflineContext)

  if (!context) {
    throw new Error('useOfflineStatus must be used inside OfflineProvider.')
  }

  return context
}
