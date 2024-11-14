'use client'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser, getRolesFromAmplifyUser, getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import { getUserProfile, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useRouter } from 'next/router'
import HeaderMenu from './Molecules/Menus/HeaderMenu'
import { AuthUser, signOut as amplifySignOut, fetchUserAttributes } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { useEffect } from 'react'

export type HubPayload = {
  event: string
  data?: any
  message?: string
}

const UserPanel = ({ palette, onChangePalette }: { palette: 'light' | 'dark'; onChangePalette: () => void }) => {
  const router = useRouter()
  const { ticket, setTicket, setProfile } = useUserController()
  const { claims, saveClaims } = useSessionStore()

  const signOut = async () => {
    try {
      await amplifySignOut()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAuthEvent = async (payload: HubPayload) => {
    const newClaims = claims.filter((m) => m.type !== 'rs')
    switch (payload.event) {
      case 'signedOut':
        await setTicket(null)
        await setProfile(null)
        saveClaims([])
        router.push('/login')
        break
      case 'signedIn':
        if (ticket) {
          return
        }
        const payloadTicket = payload.data! as AuthUser
        const attr = await fetchUserAttributes()
        const user: AmplifyUser = {
          id: payloadTicket.username,
          email: String(attr.email),
          roles: getRolesFromAmplifyUser(attr),
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
        }
        router.push('/')
        break

      case 'signIn_failure':
        await setTicket(null)
        saveClaims([])
        break
    }
  }

  useEffect(() => {
    let fn = async () => {
      if (ticket) {
        return
      }

      try {
        const user = await getUserCSR()
        await setTicket(user)
      } catch (error) {
        await setTicket(null)
      }
    }

    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])

  useEffect(() => {
    let fn = async () => {
      Hub.listen('auth', (data) => {
        const { payload } = data
        handleAuthEvent(payload)
      })
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <HeaderMenu ticket={ticket} palette={palette} onLogOutClick={signOut} onChangePalette={onChangePalette} />
    </Box>
  )
}

export default UserPanel
