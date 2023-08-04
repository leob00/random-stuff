import dayjs from 'dayjs'
import { useRouteStore, useRoutePersistentStore } from 'lib/backend/store/useRouteStore'
import { sortArray } from 'lib/util/collections'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import React from 'react'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: string
  path: string
  date: string
}

export const useRouteTracker = () => {
  // const { routes, pushRoute } = useRouteStore((state) => ({
  //   routes: state.routes,
  //   pushRoute: state.saveRoutes,
  // }))
  const { routes, pushRoute } = useRoutePersistentStore((state) => ({
    routes: state.routes,
    pushRoute: state.saveRoutes,
  }))
  //const { routesMap, saveRouteMap } = useRoutePersistentStore()
  return {
    getLastRoute: () => {
      //console.log('routes map', routesMap)
      const result = sortArray(routes, ['date'], ['desc'])
      return result.length > 1 ? result[1].path : ''
    },
    routesMap: getMapFromArray(routes, 'path'),
    routes: sortArray(routes, ['date'], ['desc']),
    addRoute: (url: string) => {
      //console.log(routes)
      const map = getMapFromArray(routes, 'path')
      //console.log(map)
      let name = url.substring(url.lastIndexOf('/') + 1)
      if (name.length == 0) {
        name = 'home'
      }
      map.set(url, {
        date: dayjs().format(),
        path: url,
        name: name,
      })
      //console.log(url.substring(url.lastIndexOf('/' + 1)))
      pushRoute(sortArray(Array.from(map.values()), ['date'], ['desc']))
    },
  }
}
