import { useSessionController } from 'hooks/sessionController'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useRouteTracker } from './useRouteTracker'

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const route = usePathname() ?? ''
  const session = useSessionController()
  const routeTracker = useRouteTracker()
  React.useEffect(() => {
    const handleRouteChange = async (url: string, shallow: boolean) => {
      if (!url.includes('/login') && !url.includes('?')) {
        session.setLastPath(route)
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
