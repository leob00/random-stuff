import { useSessionPersistentSore } from 'lib/backend/store/useRouteStore'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: string
  path: string
  date: string
}

export const useSessionSettings = () => {
  const { palette, savePalette, communityStocks, saveCommunityStocksSort } = useSessionPersistentSore((state) => ({
    palette: state.palette,
    savePalette: state.savePalette,
    communityStocks: state.communityStocks,
    saveCommunityStocksSort: state.saveCommunityStocksSort,
  }))
  return {
    palette: palette,
    savePalette: savePalette,
    communityStocks: communityStocks,
    saveCommunityStocksSort: saveCommunityStocksSort,
  }
}
