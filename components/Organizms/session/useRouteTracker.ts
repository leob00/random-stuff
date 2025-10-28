'use client'
import dayjs from 'dayjs'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { sortArray } from 'lib/util/collections'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { flatSiteMap } from '../navigation/siteMap'
import { useState } from 'react'
import { Navigation } from './useSessionSettings'

export const useRouteTracker = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { routes, saveRoutes } = useSessionStore((state) => ({
    routes: state.routes,
    saveRoutes: state.saveRoutes,
  }))

  const sitePathMapRoutes = getMapFromArray(flatSiteMap, 'path')
  const resultRoutes: Navigation[] = routes.length > 0 ? sortArray(routes, ['date'], ['desc']) : [{ category: 'Home', name: 'home', path: '/' }]
  return {
    loading: isLoading,
    previousRoute:
      routes.length > 1
        ? routes[1]
        : {
            name: 'home',
            path: '/',
          },
    allRoutes: resultRoutes,

    lastRoute: routes.length > 0 ? routes[0].path : '/',
    addRoute: (url: string) => {
      if (!sitePathMapRoutes.has(url)) {
        return
      }
      setIsLoading(true)
      const found = sitePathMapRoutes.get(url)
      if (found) {
        const routeMap = getMapFromArray(routes, 'path')
        routeMap.set(url, {
          date: dayjs().format(),
          path: found.path,
          name: found.name,
          category: found.category,
        })
        const newRoutes = sortArray(Array.from(routeMap.values()), ['date'], ['desc'])
        saveRoutes(newRoutes)
      }

      // let name = url.substring(url.lastIndexOf('/') + 1).replaceAll('-', ' ')
      // if (name.length == 0) {
      //   name = 'home'
      // }

      setIsLoading(false)
    },
  }
}
