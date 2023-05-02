import { useSessionController } from 'hooks/sessionController'
import { useUserController } from 'hooks/userController'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

const RouteTracker = ({ children }: { children: ReactNode }) => {
  const route = useRouter().asPath
  const session = useSessionController()
  const userController = useUserController()

  React.useEffect(() => {
    if (!route.includes('/login')) {
      //console.log('route: ', route)
      session.setLastPath(route)
      const profile = userController.authProfile
      if (profile) {
        if (!profile.settings) {
          profile.settings = {}
        }
        profile.settings.lastPath = route
        userController.setProfile(profile)
        putUserProfile(profile)
        //console.log(profile)
        //putUserProfile(profile)
      }
    }
  }, [route])

  return <>{children}</>
}

export default RouteTracker
