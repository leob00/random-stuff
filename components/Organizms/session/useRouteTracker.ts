'use client'
import dayjs from 'dayjs'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { sortArray } from 'lib/util/collections'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { SiteCategories, siteMap } from '../navigation/siteMap'
import { useState } from 'react'

// export interface Navigation {
//   name: string
//   path: string
//   date?: string
//   category: SiteCategories
//   isProtected?: boolean
// }

export const useRouteTracker = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { routes, saveRoutes } = useSessionStore((state) => ({
    routes: state.routes,
    saveRoutes: state.saveRoutes,
  }))

  const sitePathMapRoutes = getMapFromArray(
    siteMap().flatMap((m) => m.paths),
    'path',
  )

  return {
    loading: isLoading,
    previousRoute:
      routes.length > 1
        ? routes[1]
        : {
            name: 'home',
            path: '/',
          },
    allRoutes: sortArray(routes, ['date'], ['desc']),
    lastRoute: routes.length > 0 ? routes[0].path : '/',
    addRoute: (url: string) => {
      if (!sitePathMapRoutes.has(url)) {
        return
      }
      setIsLoading(true)
      const ex = sitePathMapRoutes.get(url)!
      const routeMap = getMapFromArray(routes, 'path')
      let name = url.substring(url.lastIndexOf('/') + 1).replaceAll('-', ' ')
      if (name.length == 0) {
        name = 'home'
      }
      routeMap.set(url, {
        date: dayjs().format(),
        path: url,
        name: name,
        category: ex.category,
      })
      const newRoutes = sortArray(Array.from(routeMap.values()), ['date'], ['desc'])
      saveRoutes(newRoutes)
      setIsLoading(false)
    },
  }
}
