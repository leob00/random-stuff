'use client'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useRouteTracker } from './useRouteTracker'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { sleep } from 'lib/util/timers'
import { flatSiteMap } from '../navigation/siteMap'
import { getMapFromArray } from 'lib/util/collectionsNative'

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const sitePathMapRoutes = getMapFromArray(flatSiteMap, 'path')
  const [isClient, setIsClient] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const router = useRouter()
  const { addRoute } = useRouteTracker()
  const handleRouteStart = async (url: string, shallow: boolean) => {
    //console.log('starting route: ', url)
    if (sitePathMapRoutes.has(url)) {
      setShowTransition(true)
      if (!url.includes('/login')) {
        addRoute(url)
      }
    }
  }
  const handleRouteEnd = async (url: string, shallow: boolean) => {
    //console.log('ending route: ', url)
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
