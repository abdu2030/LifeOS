import { create } from 'zustand'

type ThemeName = 'dark' | 'light' | 'cyberpunk' | 'forest'

type ThemeState = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}))
