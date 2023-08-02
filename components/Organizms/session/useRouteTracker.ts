import dayjs from 'dayjs'
import { useRouteStore } from 'lib/backend/store/useRouteStore'
import { sortArray } from 'lib/util/collections'
import { getListFromMap } from 'lib/util/collectionsNative'
import React from 'react'
import shallow from 'zustand/shallow'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: string
  path: string
  date: string
}

export const useRouteTracker = () => {
  //const map = new Map<string, Navigation>()
  //const [currentNav, setCurrentNav] = React.useState(map)

  const { routesMap, pushRoute } = useRouteStore(
    (state) => ({
      routesMap: state.routesMap,
      pushRoute: state.saveRouteMap,
    }),
    shallow,
  )

  return {
    getLastRoute: () => {
      const result = sortArray(getListFromMap(routesMap), ['date'], ['desc'])
      return result.length > 1 ? result[1].path : ''
    },
    routesMap: routesMap,
    routes: sortArray(getListFromMap(routesMap), ['date'], ['desc']),
    addRoute: (url: string) => {
      const map = new Map(routesMap)
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
      pushRoute(map)
    },
  }
}
