import { createContext } from 'react'

import type { OfflineStatus } from '../types/offlineQueue'

export type OfflineContextValue = OfflineStatus & {
  refreshQueue: () => Promise<void>
}

export const OfflineContext = createContext<OfflineContextValue | null>(null)
