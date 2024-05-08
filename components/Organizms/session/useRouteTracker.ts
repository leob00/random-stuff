import dayjs from 'dayjs'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
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
  const { routes, saveRoutes } = useSessionPersistentStore((state) => ({
    routes: state.routes,
    saveRoutes: state.saveRoutes,
  }))

  const sitePaths = siteMap().flatMap((m) => m.paths)

  return {
    loading: isLoading,
    getLastRoute: () => {
      const result = sortArray(routes, ['date'], ['desc'])
      return result.length > 1 ? result[1].path : '/'
    },
    //routesMap: getMapFromArray(routes, 'path'),
    routes: sortArray(routes, ['date'], ['desc']),
    addRoute: (url: string) => {
      const exists = sitePaths.findIndex((m) => m.route === url) > -1
      if (!exists) {
        return
      }
      setIsLoading(true)
      const map = getMapFromArray(routes, 'path')
      let name = url.substring(url.lastIndexOf('/') + 1).replaceAll('-', ' ')
      if (name.length == 0) {
        name = 'home'
      }
      map.set(url, {
        date: dayjs().format(),
        path: url,
        name: name,
      })
      saveRoutes(sortArray(Array.from(map.values()), ['date'], ['desc']))
      setIsLoading(false)
    },

    clearRoutes: () => {
      saveRoutes([])
    },
  }
}
