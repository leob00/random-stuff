'use client'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useRouteTracker } from './useRouteTracker'
import { Path, siteMap } from '../navigation/siteMap'
import { getMapFromArray } from 'lib/util/collectionsNative'

const routeMap = siteMap()

export const allRouteMap = () => {
  const map = new Map<string, Path>()
  const routes = routeMap.flatMap((m) => m.paths)
  routes.forEach((route) => {
    map.set(route.route, route)
  })

  // const result = getMapFromArray(
  //   siteMap().flatMap((m) => m.paths),
  //   'route',
  // )
  return map
}
const allRoutesMap = allRouteMap()

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = React.useState(false)
  const router = useRouter()

  const { addRoute } = useRouteTracker()

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  React.useEffect(() => {
    const handleRouteChange = async (url: string, shallow: boolean) => {
      if (allRoutesMap.has(url)) {
        addRoute(url)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return <>{isClient && <>{children}</>}</>
}

export default RouteTracker
