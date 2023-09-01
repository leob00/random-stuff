import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: string
  path: string
  date: string
}

export const useSessionSettings = () => {
  const { palette, savePalette, communityStocks, saveCommunityStocksSort, claims, saveClaims } = useSessionPersistentStore((state) => ({
    palette: state.palette,
    savePalette: state.savePalette,
    communityStocks: state.communityStocks,
    saveCommunityStocksSort: state.saveCommunityStocksSort,
    claims: state.claims,
    saveClaims: state.saveClaims,
  }))
  return {
    palette: palette,
    savePalette: savePalette,
    communityStocks: communityStocks,
    saveCommunityStocksSort: saveCommunityStocksSort,
    claims: claims,
    saveClaims: saveClaims,
  }
}
