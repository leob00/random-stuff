import { Person } from '@mui/icons-material'
import { Stack, Button, Divider, Typography, Box } from '@mui/material'
import { Auth, Hub } from 'aws-amplify'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { getUserProfile, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import LoggedInUserMenu from './LoggedInUserMenu'
import { VeryLightBlue } from './themes/mainTheme'

export type HubPayload = {
  event: string
  data?: any
  message?: string
}

const UserLoginPanel = ({ onLoggedOff }: { onLoggedOff?: () => void }) => {
  //const authStore = useAuthStore()
  const router = useRouter()
  const userController = useUserController()
  const signOut = () => {
    const fn = async () => {
      try {
        await Auth.signOut({ global: true })
      } catch (err) {
        await Auth.signOut({ global: false })
      }
    }

    fn()
  }

  const handleAuthEvent = async (payload: HubPayload) => {
    switch (payload.event) {
      case 'signOut':
        console.log('signing out')
        await userController.setTicket(null)
        await userController.setProfile(null)
        //await userController.setLastProfileFetchDate('')
        if (window.location.pathname.includes('protected') || window.location.pathname.includes('stocks')) {
          router.push('/login')
        }
        //router.push('/login')
        break
      case 'signIn':
        //console.log(payload)
        const user: AmplifyUser = { id: payload.data?.attributes.sub, email: payload.data?.attributes.email, roles: payload.data?.attributes['custom:roles'] }
        //console.log('user: ', user)
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
        if (window.location.pathname.includes('login')) {
          router.push('/protected/csr/dashboard')
        }
        break
      case 'signUp':
        //console.log('creating profile')
        console.log(payload.data)
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

  useEffect(() => {
    let fn = async () => {
      if (userController.ticket) {
        return
      }

      try {
        let user = await Auth.currentAuthenticatedUser()
        if (user) {
          await userController.setTicket({ id: user.attributes.id, email: user.attributes.email })
        }
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
