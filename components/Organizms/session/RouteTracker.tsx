'use client'
import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useRouteTracker } from './useRouteTracker'

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const routeTracker = useRouteTracker()
  React.useEffect(() => {
    const handleRouteChange = async (url: string, shallow: boolean) => {
      if (!url.includes('/login' || !url.includes('logoff')) && !url.includes('?')) {
        const lastRoute = routeTracker.routes.length > 0 ? routeTracker.routes[0] : undefined

        if (lastRoute) {
          const diffInMunutes = dayjs().diff(lastRoute.date, 'minutes')
          if (diffInMunutes > 1) {
            // TODO: consider saving to user profile
          }
        }
        routeTracker.addRoute(url)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, routeTracker])

  return <>{children}</>
}

export default RouteTracker
