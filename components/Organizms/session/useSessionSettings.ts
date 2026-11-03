import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { PathNames, SiteCategories } from '../navigation/siteMap'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: PathNames
  path: string
  date?: string
  category: SiteCategories
  isProtected?: boolean
  breadcrumbName?: string
  hideFromHomeMenu?: boolean
}

export const useSessionSettings = () => {
  const { communityStocks, saveCommunityStocksSort, claims, saveClaims } = useSessionStore((state) => ({
    savePalette: state.savePalette,
    communityStocks: state.communityStocks,
    saveCommunityStocksSort: state.saveCommunityStocksSort,
    claims: state.claims,
    saveClaims: state.saveClaims,
  }))
  return {
    communityStocks: communityStocks,
    saveCommunityStocksSort: saveCommunityStocksSort,
    claims: claims,
    saveClaims: saveClaims,
  }
}
