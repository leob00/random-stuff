type siteCategories = 'Markets' | 'Personal' | 'Admin' | 'Games' | 'General Interest'
type path = {
  name: string
  route: string
  isProtected?: boolean
}
export interface Paths {
  category: siteCategories
  paths: path[]
  isProtected?: boolean
}
export function siteMap() {
  const result: Paths[] = [
    {
      category: 'General Interest',
      paths: [
        {
          name: 'latest news',
          route: '/csr/news',
        },
        {
          name: 'food recipes',
          route: '/ssg/recipes',
        },
      ],
    },
    {
      category: 'Markets',
      paths: [
        {
          name: 'stocks',
          route: '/csr/stocks',
        },
        {
          name: 'community stocks',
          route: '/ssg/community-stocks',
        },
        {
          name: 'stock porfolios',
          route: '/csr/stocks/stock-porfolios',
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
  ]
  return result
}
