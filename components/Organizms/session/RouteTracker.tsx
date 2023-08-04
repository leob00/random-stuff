import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useRouteTracker } from './useRouteTracker'

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const routeTracker = useRouteTracker()
  React.useEffect(() => {
    const handleRouteChange = async (url: string, shallow: boolean) => {
      if (!url.includes('/login') && !url.includes('?') && !url.endsWith('/')) {
        routeTracker.addRoute(url)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  return <>{children}</>
}

export default RouteTracker
