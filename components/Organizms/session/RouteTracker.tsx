'use client'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useRouteTracker } from './useRouteTracker'
import { siteMap } from '../navigation/siteMap'
import { Navigation } from './useSessionSettings'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
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
  const handleRouteStart = async (url: string, shallow: boolean) => {
    //console.log('starting route: ', url)
    if (allRoutesMap.has(url)) {
      setShowTransition(true)
      addRoute(url)
    }
  }
  const handleRouteEnd = async (url: string, shallow: boolean) => {
    console.log('ending route: ', url)
  }
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteStart)

    return () => {
      router.events.off('routeChangeComplete', handleRouteEnd)
      sleep(1000).then(() => {
        setShowTransition(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <Box>
      <Box minHeight={10}>
        {showTransition && (
          <Box>
            <LinearProgress variant='indeterminate' />
          </Box>
        )}
        {children}
      </Box>
    </Box>
  )
}

export default RouteTracker
