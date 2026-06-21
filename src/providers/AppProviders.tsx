import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../features/auth/providers/AuthProvider'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
