'use client'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useRouteTracker } from './useRouteTracker'

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = React.useState(false)
  const router = useRouter()
  const { routes, addRoute } = useRouteTracker()

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  React.useEffect(() => {
    const handleRouteChange = async (url: string, shallow: boolean) => {
      //TODO: remove after sitemap comprison has been implemented
      if (!url.includes('/login' || !url.includes('logoff')) && !url.includes('recipe/') && !url.includes('sectors/') && !url.includes('industries/') && !url.includes('recipes/') && !url.includes('notes/') && !url.includes('economic-data/')) {
        const lastRoute = routes.length > 0 ? routes[0] : undefined

        if (lastRoute) {
          const diffInMunutes = dayjs().diff(lastRoute.date, 'minutes')
          if (diffInMunutes > 1) {
            // TODO: consider saving to user profile
          }
        }
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
