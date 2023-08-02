import { useSessionController } from 'hooks/sessionController'
import { useUserController } from 'hooks/userController'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useRouteTracker } from './useRouteTracker'

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const route = usePathname() ?? ''
  const session = useSessionController()
  const userController = useUserController()
  const routeTracker = useRouteTracker()
  React.useEffect(() => {
    const handleRouteChange = async (url: string, shallow: boolean) => {
      // console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`)
      if (!url.includes('/login') && !url.includes('?')) {
        session.setLastPath(route)
        // const profile = userController.authProfile ?? (await userController.fetchProfilePassive())
        // if (profile) {
        //   if (!profile.settings) {
        //     profile.settings = {}
        //   }
        //   profile.settings.lastPath = route
        //   userController.setProfile(profile)

        //   putUserProfile(profile)
        // }
        routeTracker.addRoute(url)
        //console.log('routetracker paths: ', routeTracker.getAllRoutes())
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  // React.useEffect(() => {
  //   // if (!route.includes('/login')) {
  //   //   session.setLastPath(route)
  //   //   const profile = userController.authProfile
  //   //   if (profile) {
  //   //     if (!profile.settings) {
  //   //       profile.settings = {}
  //   //     }
  //   //     profile.settings.lastPath = route
  //   //     userController.setProfile(profile)
  //   //     routeTracker.pushRoute(route)
  //   //     console.log('routetracker last path: ', routeTracker.getLastRoute())
  //   //     putUserProfile(profile)
  //   //   }
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [route])

  return <>{children}</>
}

export default RouteTracker
