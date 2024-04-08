'use client'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser, getRolesFromAmplifyUser, getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import { getUserProfile, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import { AuthUser, signOut as amplifySignOut, fetchUserAttributes } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import HeaderMenu from 'components/Molecules/Menus/HeaderMenu'

export type HubPayload = {
  event: string
  data?: any
  message?: string
}

const UserPanel = ({ palette, onChangePalette }: { palette: 'light' | 'dark'; onChangePalette: () => void }) => {
  const router = useRouter()
  const { ticket, setTicket, setProfile } = useUserController()
  const { clearRoutes, getLastRoute } = useRouteTracker()

  const { claims, saveClaims } = useSessionPersistentStore()
  const searchParams = useSearchParams()
  const signOut = async () => {
    try {
      //console.log('signing out...')
      await amplifySignOut({ global: true })
    } catch (err) {
      console.log(err)
    }
  }

  const handleNavigationEvent = (payload: HubPayload) => {
    // console.log('last path: ', payload.data.lastPath)
    // console.log('payload data: ', payload.data)
  }

  const handleAuthEvent = async (payload: HubPayload) => {
    const newClaims = claims.filter((m) => m.type !== 'rs')
    switch (payload.event) {
      case 'signedOut':
        console.log('signing out')
        await setTicket(null)
        const lastRoute = getLastRoute()
        await setProfile(null)
        clearRoutes()
        saveClaims([])
        router.push(`/signOut?ret=${encodeURIComponent(lastRoute)}`)
        break
      case 'signedIn':
        if (ticket) {
          return
        }
        console.log('payload.data: ', payload.data)
        const payloadTicket = payload.data! as AuthUser
        const attr = await fetchUserAttributes()
        console.log('attr: ', attr)
        const user: AmplifyUser = {
          id: payloadTicket.username,
          email: String(attr.email),
          roles: getRolesFromAmplifyUser(payloadTicket, attr),
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
        const isAdmin = userHasRole('Admin', user.roles)
        const now = dayjs()
        newClaims.push({
          token: crypto.randomUUID(),
          type: 'rs',
          tokenExpirationSeconds: dayjs(now).diff(now.add(30, 'days'), 'second'),
        })
        if (isAdmin) {
          newClaims.push({
            token: crypto.randomUUID(),
            type: 'rs-admin',
            tokenExpirationSeconds: dayjs(now).diff(now.add(1, 'days'), 'second'),
          })
        }
        saveClaims(newClaims)
        const currentRoute = window.URL.toString()
        if (currentRoute.includes('signOut')) {
          const ret = searchParams?.get('ret') ?? ''
          if (ret.length > 0) {
            router.push(ret)
          } else {
            const lastPath = getLastRoute()
            if (lastPath.length === 0) {
              router.push('/')
              return
            }
            router.push(lastPath)
          }
        } else {
          router.push('/')
        }
        break
      case 'signedUp':
        const signedUpAttr = await fetchUserAttributes()
        const newUser = { email: String(signedUpAttr.email) }
        const existingProfile = (await getUserProfile(newUser.email)) as UserProfile | null
        if (!existingProfile) {
          const newProfile: UserProfile = {
            id: constructUserProfileKey(newUser.email),
            username: newUser.email,
          }
          await putUserProfile(newProfile)
          setProfile(newProfile)
          newClaims.push({
            token: crypto.randomUUID(),
            type: 'rs',
            tokenExpirationSeconds: 6400000,
          })
          saveClaims(newClaims)
          router.push('/')
        } else {
          router.push('/protected/csr/dashboard')
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
      <HeaderMenu ticket={ticket} palette={palette} onLogOutClick={signOut} onChangePalette={onChangePalette} />
    </>
  )
}

export default UserPanel
