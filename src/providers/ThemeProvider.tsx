import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { useThemeStore } from '../stores/themeStore'

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return children
}
