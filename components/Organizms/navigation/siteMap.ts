export type SiteCategories = 'Stocks' | 'Personal' | 'Admin' | 'Games' | 'General Interest' | 'Utilities' | 'Pictures' | 'Economy' | 'Miscellaneous'
type path = {
  name: string
  route: string
  isProtected?: boolean
}
export interface Paths {
  category: SiteCategories
  paths: path[]
  isProtected?: boolean
}

export function siteMap() {
  const result: Paths[] = [
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
      category: 'Stocks',
      paths: [
        {
          name: 'my stocks',
          route: '/csr/my-stocks',
        },
        {
          name: 'community',
          route: '/csr/community-stocks',
        },
        {
          name: 'porfolios',
          route: '/csr/stocks/stock-porfolios',
        },
        {
          name: 'stock tags',
          route: '/csr/stocks/stock-tags',
        },
      ],
    },
    {
      category: 'Economy',
      paths: [
        {
          name: 'calendar',
          route: '/csr/economic-calendar',
        },
        {
          name: 'data',
          route: '/csr/economic-data',
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
