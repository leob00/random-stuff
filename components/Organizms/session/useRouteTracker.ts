import dayjs from 'dayjs'
import { useSessionPersistentSore } from 'lib/backend/store/useRouteStore'
import { sortArray } from 'lib/util/collections'
import { getMapFromArray } from 'lib/util/collectionsNative'

export type NavigationName = 'stocks' | 'goals' | 'home' | 'news' | 'notes' | 'admin'
export interface Navigation {
  name: string
  path: string
  date: string
}

export const useRouteTracker = () => {
  const { routes, saveRoutes } = useSessionPersistentSore((state) => ({
    routes: state.routes,
    saveRoutes: state.saveRoutes,
  }))
  return {
    getLastRoute: () => {
      const result = sortArray(routes, ['date'], ['desc'])
      return result.length > 1 ? result[1].path : ''
    },
    //routesMap: getMapFromArray(routes, 'path'),
    routes: sortArray(routes, ['date'], ['desc']),
    addRoute: (url: string) => {
      const map = getMapFromArray(routes, 'path')
      let name = url.substring(url.lastIndexOf('/') + 1).replace('-', ' ')
      if (name.length == 0) {
        name = 'home'
      }
      map.set(url, {
        date: dayjs().format(),
        path: url,
        name: name,
      })
      saveRoutes(sortArray(Array.from(map.values()), ['date'], ['desc']))
    },

    clear: () => {
      saveRoutes([])
    },
  }
}
