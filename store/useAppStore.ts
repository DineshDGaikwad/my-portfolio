import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  theme: 'dark' | 'light'
  devMode: boolean
  activeSection: string
  toggleTheme: () => void
  toggleDevMode: () => void
  setActiveSection: (section: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      devMode: false,
      activeSection: 'hero',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      toggleDevMode: () => set((state) => ({ devMode: !state.devMode })),
      setActiveSection: (section) => set({ activeSection: section }),
    }),
    {
      name: 'portfolio-store',
      // BUG FIX 12: don't persist activeSection — it should always reset to 'hero' on load
      partialize: (state) => ({ theme: state.theme, devMode: state.devMode }),
    }
  )
)
