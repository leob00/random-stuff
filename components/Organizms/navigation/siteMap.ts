import { chunk } from 'lodash'
import { Navigation } from '../session/useSessionSettings'

export type SiteCategories =
  | 'Markets'
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
    category: 'Markets',
  },
  {
    name: 'community stocks',
    path: '/csr/community-stocks',
    category: 'Markets',
  },
  {
    name: 'stock sentiment',
    path: '/csr/stocks/sentiment',
    category: 'Markets',
  },
  {
    name: 'earnings calendar',
    path: '/csr/stocks/earnings-calendar',
    category: 'Markets',
  },
  {
    name: 'earnings report',
    path: '/csr/stocks/earnings-reports',
    category: 'Markets',
  },
  {
    name: 'commodities',
    path: '/csr/commodities',
    category: 'Markets',
  },
  {
    name: 'stock alerts',
    path: '/csr/stocks/alerts',
    category: 'Markets',
  },
  {
    name: 'crypto',
    path: '/csr/crypto',
    category: 'Markets',
  },
  {
    name: 'advanced search',
    path: '/csr/stocks/advanced-search',
    category: 'Markets',
  },
  {
    name: 'volume leaders',
    path: '/ssg/stocks/reports/volume-leaders',
    category: 'Stock Reports',
  },
  {
    name: 'market cap leaders',
    path: '/ssg/stocks/reports/market-cap-leaders',
    category: 'Stock Reports',
  },
  {
    name: 'top movers',
    path: '/ssg/stocks/reports/topmvgavg',
    category: 'Stock Reports',
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
  {
    name: 'stock tags',
    path: '/csr/stocks/stock-tags',
    category: 'Stock Reports',
  },
  {
    name: 'dividend payers',
    path: '/csr/stocks/dividend-payers',
    category: 'Stock Reports',
  },
  {
    name: 'economic indicators',
    path: '/csr/economic-indicators',
    category: 'Economy',
  },
  {
    name: 'economic calendar',
    path: '/csr/economic-calendar',
    category: 'Economy',
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
    path: '/protected/csr/secrets',
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
    name: 'extract text from image',
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
]
