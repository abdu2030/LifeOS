import { create } from 'zustand'

export type ThemeName = 'dark' | 'light' | 'cyberpunk' | 'forest'

type ThemeState = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('lifeos-theme') as ThemeName | null) ?? 'dark',
  setTheme: (theme) => {
    localStorage.setItem('lifeos-theme', theme)
    set({ theme })
  },
}))
