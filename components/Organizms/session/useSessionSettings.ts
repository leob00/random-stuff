import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { SiteCategories } from '../navigation/siteMap'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: string
  path: string
  date?: string
  category: SiteCategories
  isProtected?: boolean
}

export const useSessionSettings = () => {
  const { palette, savePalette, communityStocks, saveCommunityStocksSort, claims, saveClaims } = useSessionStore((state) => ({
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
