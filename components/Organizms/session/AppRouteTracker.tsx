'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useRouteTracker } from './useRouteTracker'

const AppRouteTracker = () => {
  const { routes, addRoute } = useRouteTracker()
  // const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    console.log('route: ', pathname)
    if (pathname) {
      addRoute(pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // React.useEffect(() => {
  //   const handleRouteChange = async (url: string, shallow: boolean) => {
  //     if (
  //       !url.includes('/login' || !url.includes('logoff')) &&
  //       !url.includes('recipe') &&
  //       //&& !url.includes('reports/')
  //       !url.includes('sectors/') &&
  //       !url.includes('industries/') &&
  //       !url.includes('?')
  //     ) {
  //       const lastRoute = routes.length > 0 ? routes[0] : undefined

  //       if (lastRoute) {
  //         const diffInMunutes = dayjs().diff(lastRoute.date, 'minutes')
  //         if (diffInMunutes > 1) {
  //           // TODO: consider saving to user profile
  //         }
  //       }
  //       addRoute(url)
  //     }
  //   }

  //   router.events.on('routeChangeStart', handleRouteChange)

  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChange)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [router])

  return <></>
}

export default AppRouteTracker
