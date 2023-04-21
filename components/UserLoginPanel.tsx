import { Person } from '@mui/icons-material'
import { Stack, Button, Divider, Typography, Box } from '@mui/material'
import { Auth, Hub } from 'aws-amplify'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser, getRolesFromAmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserProfile, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import LoggedInUserMenu from './LoggedInUserMenu'
import { VeryLightBlue } from './themes/mainTheme'

export type HubPayload = {
  event: string
  data?: any
  message?: string
}

const UserLoginPanel = ({ onLoggedOff }: { onLoggedOff?: () => void }) => {
  const router = useRouter()
  const [calledPush, setCalledPush] = React.useState(false)

  const path = router.asPath
  const [lastPath, setLastPath] = React.useState(path.includes('/login') ? '/' : path)

  const userController = useUserController()
  const signOut = async () => {
    const p = router.asPath
    const fn = async () => {
      if (!p.includes(' /login')) {
        Hub.dispatch('navigation', {
          event: 'signed_out',
          data: { lastPath: p },
        })
      }
      try {
        await Auth.signOut({ global: true })
      } catch (err) {
        await Auth.signOut({ global: false })
      }
    }

    fn()
  }

  const handleNavigationEvent = async (payload: HubPayload) => {
    setLastPath(payload.data.lastPath)
    // console.log('payload data: ', payload.data)
  }

  const handleAuthEvent = async (payload: HubPayload) => {
    switch (payload.event) {
      case 'signOut':
        console.log('signing out')
        await userController.setTicket(null)
        await userController.setProfile(null)
        setCalledPush(false)
        router.push(`/login`)
        break
      case 'signIn':
        const ticket = payload.data!
        const user: AmplifyUser = {
          id: payload.data?.attributes.sub,
          email: payload.data?.attributes.email,
          roles: getRolesFromAmplifyUser(ticket),
        }
        await userController.setTicket(user)
        let p = (await getUserProfile(user.email)) as UserProfile | null
        if (!p) {
          p = {
            id: constructUserProfileKey(user.email),
            noteTitles: [],
            username: user.email,
          }

          await putUserProfile(p)
        }
        userController.setProfile(p)
        if (!calledPush) {
          //console.log('redirecting to: ', lastPath)
          router.push('/protected/csr/dashboard')
        }

        break
      case 'signUp':
        const newUser = { email: payload.data?.user.username }
        const existingProfile = (await getUserProfile(newUser.email)) as UserProfile | null
        if (!existingProfile) {
          const newProfile: UserProfile = {
            id: constructUserProfileKey(newUser.email),
            noteTitles: [],
            username: newUser.email,
          }
          userController.setProfile(newProfile)
          await putUserProfile(newProfile)
        }
        break

      case 'signIn_failure':
        await userController.setTicket(null)
        break
    }
  }

  React.useEffect(() => {
    let fn = async () => {
      if (userController.ticket) {
        return
      }

      try {
        let user = await getUserCSR()
        await userController.setTicket(user)
      } catch (error) {
        await userController.setTicket(null)
      }
    }

    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

  const handleLoginClick = async () => {
    router.push('/login')
  }

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
      <Box justifyContent={'space-evenly'} display='flex' alignItems={'center'}>
        {userController.ticket ? (
          <>
            <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />} mt={'6px'}>
              <Stack flexGrow={1}></Stack>
              <LoggedInUserMenu onLogOut={signOut} username={userController.ticket.email} />
            </Stack>
          </>
        ) : (
          <>
            <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />} mt={'6px'}>
              <Stack flexGrow={1}></Stack>
              <Stack justifyContent={'center'} alignItems={'center'}>
                <Button onClick={handleLoginClick} size='small' sx={{}}>
                  <Person fontSize='small' />
                  <Typography variant='body2' sx={{ color: VeryLightBlue }}>
                    Sign In
                  </Typography>
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </Box>
    </>
  )
}

export default UserLoginPanel
