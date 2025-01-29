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
  | 'Reports'
  | 'Home'
export type Path = {
  name: string
  route: string
  isProtected?: boolean
}
export interface Paths {
  category: SiteCategories
  paths: Navigation[]
  isProtected?: boolean
}

export function siteMap() {
  const result: Paths[] = [
    {
      category: 'Home',
      paths: [
        {
          name: 'home',
          path: '/',
          category: 'Home',
        },
      ],
    },
    {
      category: 'General Interest',
      paths: [
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
      ],
    },
    {
      category: 'Markets',
      paths: [
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
          name: 'crypto',
          path: '/csr/crypto',
          category: 'Markets',
        },
      ],
    },
    {
      category: 'Reports',
      paths: [
        {
          name: 'volume leaders',
          path: '/ssg/stocks/reports/volume-leaders',
          category: 'Reports',
        },
        {
          name: 'market cap leaders',
          path: '/ssg/stocks/reports/market-cap-leaders',
          category: 'Reports',
        },
        {
          name: 'sectors',
          path: '/csr/stocks/sectors',
          category: 'Reports',
        },
        {
          name: 'industries',
          path: '/csr/stocks/industries',
          category: 'Reports',
        },
        {
          name: 'stock tags',
          path: '/csr/stocks/stock-tags',
          category: 'Reports',
        },
        {
          name: 'dividend payers',
          path: '/csr/stocks/dividend-payers',
          category: 'Reports',
        },
      ],
    },
    {
      category: 'Economy',
      paths: [
        {
          name: 'economic indicators',
          path: '/csr/economic-indicators',
          category: 'Economy',
        },
      ],
    },
    {
      category: 'Personal',
      paths: [
        {
          name: 'goals',
          path: '/protected/csr/goals',
          category: 'Economy',
          isProtected: true,
        },
        {
          name: 'notes',
          path: '/protected/csr/notes',
          category: 'Economy',
          isProtected: true,
        },
        {
          name: 'dashboard',
          path: '/protected/csr/dashboard',
          category: 'Economy',
          isProtected: true,
        },
        {
          name: 'secrets',
          path: '/protected/csr/secrets',
          category: 'Economy',
          isProtected: true,
        },
      ],
    },
    {
      category: 'Games',
      paths: [
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
      ],
    },
    {
      category: 'Utilities',
      paths: [
        {
          name: 'calculator',
          path: '/csr/calculator',
          category: 'Games',
        },
        {
          name: 'extract text from image',
          path: '/csr/files/extract-text-from-image',
          category: 'Games',
        },
      ],
    },
    {
      category: 'Pictures',
      paths: [
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
      ],
    },
    {
      category: 'Admin',
      paths: [
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
      ],
    },
  ]
  return result
}
