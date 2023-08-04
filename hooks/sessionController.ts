import { useSessionStore } from 'lib/backend/store/useSessionStore'

export const useSessionController = () => {
  const { lastPath, setLastPath } = useSessionStore((state) => ({
    lastPath: state.lastPath,
    setLastPath: state.setLastPath,
  }))

  return {
    lastPath: lastPath,

    setLastPath: async (item: string) => {
      setLastPath(item)
    },
  }
}
