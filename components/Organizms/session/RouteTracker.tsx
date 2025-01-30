'use client'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useRouteTracker } from './useRouteTracker'
import { siteMap } from '../navigation/siteMap'
import { Navigation } from './useSessionSettings'
import { LinearProgress } from '@mui/material'
import { sleep } from 'lib/util/timers'

const routeMap = siteMap()

export const allRouteMap = () => {
  const map = new Map<string, Navigation>()
  const routes = routeMap.flatMap((m) => m.paths)
  routes.forEach((route) => {
    map.set(route.path, route)
  })
  return map
}
const allRoutesMap = allRouteMap()

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const router = useRouter()
  const { addRoute } = useRouteTracker()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleRouteChange = async (url: string, shallow: boolean) => {
      if (allRoutesMap.has(url)) {
        addRoute(url)
      }

      setShowTransition(true)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      sleep(1000).then(() => {
        setShowTransition(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <>
      {isClient && (
        <>
          {showTransition && <LinearProgress variant='indeterminate' />}
          {children}
        </>
      )}
    </>
  )
}

export default RouteTracker
