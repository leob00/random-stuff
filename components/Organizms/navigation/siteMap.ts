import { chunk } from 'lodash'
import { Navigation } from '../session/useSessionSettings'

export type PathNames =
  | 'stocks'
  | 'my stocks'
  | 'earnings calendar'
  | 'sentiment'
  | 'earnings report'
  | 'stock alerts'
  | 'search'
  | 'goals'
  | 'notes'
  | 'dashboard'
  | 'secrets'
  | 'chat with AI'
  | 'crypto'
  | 'commodities'
  | 'treasuries'
  | 'calendar'
  | 'indicators'
  | 'news'
  | 'recipes'
  | 'volume leaders'
  | 'markect cap leaders'
  | 'sectors'
  | 'industries'
  | 'top movers'
  | 'dividend payers'
  | 'calculator'
  | 'coin flip'
  | 'roulette'
  | 'dogs'
  | 'cats'
  | 'image text'
  | 'profile'
  | 'stock market summary'
  | (string & {})

export type SiteCategories =
  | 'Stock Market'
  | 'Other Markets'
  | 'Personal'
  | 'Admin'
  | 'Games'
  | 'General Interest'
  | 'Utilities'
  | 'Pictures'
  | 'Economy'
  | 'Miscellaneous'
  | 'Stock Reports'
  | 'Home'
  | 'Account'

export interface Paths {
  category: SiteCategories
  paths: Navigation[]
  chunkedPaths: Navigation[][]
}

export function pathsByCategory() {
  const all = [...flatSiteMap]
  const allCategories = new Set(all.map((m) => m.category))
  const result: Paths[] = []
  allCategories.forEach((cat) => {
    result.push({
      category: cat,
      paths: all.filter((m) => m.category === cat),
      chunkedPaths: chunk(
        all.filter((m) => m.category === cat),
        2,
      ),
    })
  })

  return result
}

export const flatSiteMap: Navigation[] = [
  {
    category: 'Home',
    name: 'home',
    path: '/',
  },
  {
    name: 'chat with AI',
    path: '/csr/ai/anthropic',
    category: 'General Interest',
  },
  {
    name: 'news',
    path: '/csr/news',
    category: 'General Interest',
  },
  {
    name: 'recipes',
    path: '/ssg/recipes',
    category: 'General Interest',
  },
  {
    name: 'my stocks',
    path: '/csr/my-stocks',
    category: 'Stock Market',
  },
  {
    name: 'stocks',
    path: '/csr/community-stocks',
    category: 'Stock Market',
  },
  {
    name: 'sentiment',
    path: '/csr/stocks/sentiment',
    category: 'Stock Market',
    breadcrumbName: 'stock sentiment',
  },
  {
    name: 'earnings calendar',
    path: '/csr/stocks/earnings-calendar',
    category: 'Stock Market',
  },
  {
    name: 'earnings report',
    path: '/csr/stocks/earnings-reports',
    category: 'Stock Market',
    hideFromHomeMenu: true,
  },
  {
    name: 'summary',
    path: '/market/stocks/summary',
    category: 'Stock Market',
    hideFromHomeMenu: false,
    breadcrumbName: 'stock market summary',
  },

  {
    name: 'stock alerts',
    path: '/csr/stocks/alerts',
    category: 'Stock Market',
  },
  {
    name: 'commodities',
    path: '/csr/commodities',
    category: 'Other Markets',
  },
  {
    name: 'crypto',
    path: '/csr/crypto',
    category: 'Other Markets',
  },
  {
    name: 'treasuries',
    path: '/market/treasuries',
    category: 'Other Markets',
  },
  {
    name: 'search',
    path: '/csr/stocks/advanced-search',
    category: 'Stock Market',
    breadcrumbName: 'stock search',
  },
  {
    name: 'volume',
    path: '/ssg/stocks/reports/volume-leaders',
    category: 'Stock Reports',
    breadcrumbName: 'volume leaders',
  },
  {
    name: 'market cap',
    path: '/ssg/stocks/reports/market-cap-leaders',
    category: 'Stock Reports',
    breadcrumbName: 'market cap leaders',
  },
  {
    name: 'top movers',
    path: '/ssg/stocks/reports/topmvgavg',
    category: 'Stock Reports',
    breadcrumbName: 'top stock movers',
  },
  {
    name: 'sectors',
    path: '/csr/stocks/sectors',
    category: 'Stock Reports',
  },
  {
    name: 'industries',
    path: '/csr/stocks/industries',
    category: 'Stock Reports',
  },
  // {
  //   name: 'stock tags',
  //   path: '/csr/stocks/stock-tags',
  //   category: 'Stock Reports',
  // },
  {
    name: 'dividend payers',
    path: '/csr/stocks/dividend-payers',
    category: 'Stock Reports',
  },
  {
    name: 'indicators',
    path: '/csr/economic-indicators',
    category: 'Economy',
    breadcrumbName: 'economic indicators',
  },
  {
    name: 'calendar',
    path: '/csr/economic-calendar',
    category: 'Economy',
    breadcrumbName: 'economic calendar',
  },
  {
    name: 'goals',
    path: '/protected/csr/goals',
    category: 'Personal',
    isProtected: true,
  },
  {
    name: 'notes',
    path: '/protected/csr/notes',
    category: 'Personal',
    isProtected: true,
  },
  {
    name: 'dashboard',
    path: '/protected/csr/dashboard',
    category: 'Personal',
    isProtected: true,
  },
  {
    name: 'secrets',
    path: '/personal/secrets',
    category: 'Personal',
    isProtected: true,
  },
  {
    name: 'coin flip',
    path: '/ssg/coin-flip',
    category: 'Games',
  },
  {
    name: 'roulette',
    path: '/ssg/roulette',
    category: 'Games',
  },
  {
    name: 'calculator',
    path: '/csr/calculator',
    category: 'Utilities',
  },
  {
    name: 'image text',
    path: '/csr/files/extract-text-from-image',
    category: 'Utilities',
  },
  {
    name: 'dogs',
    path: '/ssg/dogs',
    category: 'Pictures',
  },
  {
    name: 'cats',
    path: '/ssg/cats',
    category: 'Pictures',
  },
  {
    name: 'admin',
    path: '/protected/csr/admin',
    category: 'Admin',
    isProtected: true,
  },
  {
    name: 'sandbox',
    path: '/protected/csr/sandbox',
    category: 'Admin',
    isProtected: true,
  },
  {
    name: 'status',
    path: '/status',
    category: 'Admin',
    isProtected: true,
  },
  {
    name: 'profile',
    path: '/account/profile',
    category: 'Account',
    isProtected: true,
  },
]
