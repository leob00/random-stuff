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
  paths: Path[]
  isProtected?: boolean
}

export function siteMap() {
  const result: Paths[] = [
    {
      category: 'Home',
      paths: [
        {
          name: 'home',
          route: '/',
        },
      ],
    },
    {
      category: 'General Interest',
      paths: [
        {
          name: 'news',
          route: '/csr/news',
        },
        {
          name: 'recipes',
          route: '/ssg/recipes',
        },
      ],
    },
    {
      category: 'Markets',
      paths: [
        {
          name: 'my stocks',
          route: '/csr/my-stocks',
        },
        {
          name: 'community stocks',
          route: '/csr/community-stocks',
        },
        {
          name: 'stock sentiment',
          route: '/csr/stocks/sentiment',
        },
        {
          name: 'commodities',
          route: '/csr/commodities',
        },
        {
          name: 'earnings calendar',
          route: '/csr/stocks/earnings-calendar',
        },
        {
          name: 'earnings report',
          route: '/csr/stocks/earnings-reports',
        },
        {
          name: 'crypto',
          route: '/csr/crypto',
        },
        {
          name: 'stock tags',
          route: '/csr/stocks/stock-tags',
        },
      ],
    },
    {
      category: 'Reports',
      paths: [
        {
          name: 'volume leaders',
          route: '/ssg/stocks/reports/volume-leaders',
        },
        {
          name: 'market cap leaders',
          route: '/ssg/stocks/reports/market-cap-leaders',
        },
        {
          name: 'sectors',
          route: '/csr/stocks/sectors',
        },
        {
          name: 'industries',
          route: '/csr/stocks/industries',
        },
        {
          name: 'stock tags',
          route: '/csr/stocks/stock-tags',
        },
        {
          name: 'dividend payers',
          route: '/csr/stocks/dividend-payers',
        },
      ],
    },
    {
      category: 'Economy',
      paths: [
        // {
        //   name: 'econ calendar',
        //   route: '/csr/economic-calendar',
        // },
        {
          name: 'economic indicators',
          route: '/csr/economic-indicators',
        },
      ],
    },
    {
      category: 'Personal',
      paths: [
        {
          name: 'goals',
          route: '/protected/csr/goals',
          isProtected: true,
        },
        {
          name: 'notes',
          route: '/protected/csr/notes',
          isProtected: true,
        },
        {
          name: 'dashboard',
          route: '/protected/csr/dashboard',
          isProtected: true,
        },
        {
          name: 'secrets',
          route: '/protected/csr/secrets',
          isProtected: true,
        },
      ],
    },
    {
      category: 'Games',
      paths: [
        {
          name: 'coin flip',
          route: '/ssg/coin-flip',
        },
        {
          name: 'roulette',
          route: '/ssg/roulette',
        },
      ],
    },
    {
      category: 'Utilities',
      paths: [
        {
          name: 'calculator',
          route: '/csr/calculator',
        },
        {
          name: 'extract text from image',
          route: '/csr/files/extract-text-from-image',
        },
      ],
    },
    {
      category: 'Pictures',
      paths: [
        {
          name: 'dogs',
          route: '/ssg/dogs',
        },
        {
          name: 'cats',
          route: '/ssg/cats',
        },
      ],
    },
    {
      category: 'Admin',
      paths: [
        {
          name: 'admin',
          route: '/protected/csr/admin',
        },
        {
          name: 'sandbox',
          route: '/protected/csr/sandbox',
        },
        {
          name: 'status',
          route: '/status',
        },
      ],
    },
  ]
  return result
}
