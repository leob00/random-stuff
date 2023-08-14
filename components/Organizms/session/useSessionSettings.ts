import { useSessionPersistentSore } from 'lib/backend/store/useRouteStore'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: string
  path: string
  date: string
}

export const useSessionSettings = () => {
  const { palette, savePalette } = useSessionPersistentSore((state) => ({
    palette: state.palette,
    savePalette: state.savePalette,
  }))
  return {
    palette: palette,
    savePalette: savePalette,
  }
}
