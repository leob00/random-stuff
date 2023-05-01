import create from 'zustand'

interface SessionState {
  lastPath: string
  setLastPath: (item: string) => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  lastPath: '/',
  setLastPath: (item: string) => set((state) => ({ ...state, lastPath: item })),
}))
