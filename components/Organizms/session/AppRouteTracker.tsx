'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useRouteTracker } from './useRouteTracker'

const AppRouteTracker = () => {
  const { allRoutes: routes, addRoute } = useRouteTracker()
  const pathname = usePathname()

  React.useEffect(() => {
    if (pathname) {
      addRoute(pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return <></>
}

export default AppRouteTracker
