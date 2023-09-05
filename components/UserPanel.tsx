'use client'
import { Box } from '@mui/material'
import { Auth, Hub } from 'aws-amplify'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser, getRolesFromAmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
import { useRouter } from 'next/navigation'
import React from 'react'
import HeaderMenu from './Molecules/Menus/HeaderMenu'
import { useRouteTracker } from './Organizms/session/useRouteTracker'

export type HubPayload = {
  event: string
  data?: any
  message?: string
}

const UserPanel = ({ palette, onChangePalette }: { palette: 'light' | 'dark'; onChangePalette: () => void }) => {
  const router = useRouter()
  const [calledPush, setCalledPush] = React.useState(false)
  const { ticket, setTicket, setProfile } = useUserController()
  const { clearRoutes, getLastRoute } = useRouteTracker()
  const { claims, saveClaims } = useSessionPersistentStore()
  const signOut = async () => {
    try {
      await Auth.signOut({ global: false })
    } catch (err) {
      console.log(err)
    }
  }

  const handleNavigationEvent = (payload: HubPayload) => {
    //console.log('last path: ', payload.data.lastPath)
    // console.log('payload data: ', payload.data)
  }

  const handleAuthEvent = async (payload: HubPayload) => {
    const newClaims = claims.filter((m) => m.type !== 'rs')
    switch (payload.event) {
      case 'signOut':
        console.log('signing out')
        await setTicket(null)
        await setProfile(null)
        clearRoutes()
        saveClaims([])
        setCalledPush(false)
        if (!calledPush) {
          router.push(`/login`)
        }
        break
      case 'signIn':
        const ticket = payload.data!
        const user: AmplifyUser = {
          id: payload.data?.attributes.sub,
          email: payload.data?.attributes.email,
          roles: getRolesFromAmplifyUser(ticket),
        }
        await setTicket(user)
        let p = (await getUserProfile(user.email)) as UserProfile | null
        if (!p) {
          p = {
            id: constructUserProfileKey(user.email),
            username: user.email,
          }
          await putUserProfile(p)
        }
        setProfile(p)
        newClaims.push({
          token: crypto.randomUUID(),
          type: 'rs',
          tokenExpirationSeconds: 6400000,
        })
        saveClaims(newClaims)
        if (!calledPush) {
          const lastPath = getLastRoute()
          if (lastPath.length === 0) {
            router.push('/')
            return
          }
          router.push(lastPath)
        }
        break
      case 'signUp':
        const newUser = { email: payload.data?.user.username }
        const existingProfile = (await getUserProfile(newUser.email)) as UserProfile | null
        if (!existingProfile) {
          const newProfile: UserProfile = {
            id: constructUserProfileKey(newUser.email),
            username: newUser.email,
          }
          setProfile(newProfile)
          await putUserProfile(newProfile)
          newClaims.push({
            token: crypto.randomUUID(),
            type: 'rs',
            tokenExpirationSeconds: 6400000,
          })
          saveClaims(newClaims)
        }
        break

      case 'signIn_failure':
        await setTicket(null)
        saveClaims([])
        break
    }
  }

  React.useEffect(() => {
    let fn = async () => {
      if (ticket) {
        return
      }

      try {
        let user = await getUserCSR()
        await setTicket(user)
      } catch (error) {
        await setTicket(null)
      }
    }

    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])

  React.useEffect(() => {
    let fn = async () => {
      Hub.listen('auth', (data) => {
        const { payload } = data
        handleAuthEvent(payload)
      })
      Hub.listen('navigation', (data) => {
        const { payload } = data
        handleNavigationEvent(payload)
      })
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Box justifyContent={'space-evenly'} display='flex' alignItems={'center'} gap={4}>
        <HeaderMenu ticket={ticket} palette={palette} onLogOutClick={signOut} onChangePalette={onChangePalette} />
      </Box>
    </>
  )
}

export default UserPanel
