import { useSessionStore } from 'lib/backend/session/useSessionStore'
import shallow from 'zustand/shallow'

export const useSessionController = () => {
  const { lastPath, setLastPath } = useSessionStore(
    (state) => ({
      lastPath: state.lastPath,
      setLastPath: state.setLastPath,
    }),
    shallow,
  )

  return {
    lastPath: lastPath,

    setLastPath: async (item: string) => {
      setLastPath(item)
    },
  }
}
