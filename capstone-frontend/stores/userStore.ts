import { create } from 'zustand'

interface UserState {
  theme: 'light' | 'dark' | null | undefined
  initTheme: (theme: UserState['theme']) => void
  toggleTheme: () => void
}

const useUserStore = create<UserState>((set) => ({
  theme: null,
  initTheme: (theme) => set(() => ({
    theme
  })),
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? "dark" : "light"
  }))
}))

export {useUserStore}