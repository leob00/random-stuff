import dayjs from 'dayjs'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { sortArray } from 'lib/util/collections'
import { getMapFromArray } from 'lib/util/collectionsNative'
import React from 'react'
import { siteMap } from '../navigation/siteMap'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: string
  path: string
  date: string
}

export const useRouteTracker = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { routes, saveRoutes } = useSessionStore((state) => ({
    routes: state.routes,
    saveRoutes: state.saveRoutes,
  }))

  const sitePathMap = getMapFromArray(
    siteMap().flatMap((m) => m.paths),
    'route',
  )

  return {
    loading: isLoading,
    getLastRoute: () => {
      const result = sortArray(routes, ['date'], ['desc'])
      return result.length > 1 ? result[1].path : '/'
    },
    allRoutes: sortArray(routes, ['date'], ['desc']),
    lastRoute: routes.length > 0 ? routes[0].path : '/',
    addRoute: (url: string) => {
      if (!sitePathMap.has(url)) {
        return
      }
      setIsLoading(true)
      const routeMap = getMapFromArray(routes, 'path')
      let name = url.substring(url.lastIndexOf('/') + 1).replaceAll('-', ' ')
      if (name.length == 0) {
        name = 'home'
      }

      routeMap.set(url, {
        date: dayjs().format(),
        path: url,
        name: name,
      })
      const newRoutes = sortArray(Array.from(routeMap.values()), ['date'], ['desc'])
      saveRoutes(newRoutes)
      setIsLoading(false)
    },
  }
}
