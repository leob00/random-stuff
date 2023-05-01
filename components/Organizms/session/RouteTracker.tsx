import { useSessionController } from 'hooks/sessionController'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const route = useRouter().asPath
  const session = useSessionController()

  React.useEffect(() => {
    if (!route.includes('/login')) {
      console.log('route: ', route)
      session.setLastPath(route)
    }
  }, [route])

  return <>{children}</>
}

export default RouteTracker
