import { Person } from '@mui/icons-material'
import { Stack, Button, Divider, Typography, Box } from '@mui/material'
import { Auth, Hub } from 'aws-amplify'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
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

const UserLoginPanel = () => {
  //const authStore = useAuthStore()
  const router = useRouter()
  const userController = useUserController()
  const signOut = () => {
    const fn = async () => {
      try {
        await Auth.signOut({ global: true })
      } catch (err) {}
    }

    fn()
  }

  const handleAuthEvent = async (payload: HubPayload) => {
    switch (payload.event) {
      case 'signOut':
        console.log('signing out')
        await userController.setIsLoggedIn(false)
        await userController.setUsername(null)
        await userController.setProfile(null)
        //await userController.setLastProfileFetchDate('')
        router.push('/login')
        break
      case 'signIn':
        const user = { email: payload.data?.attributes.email, roles: payload.data?.attributes['custom:roles'] }
        await userController.setIsLoggedIn(true)
        await userController.setUsername(user.email)
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
          router.push('/ssg/waitandredirect?id=protected/csr/dashboard')
        }
        break
      case 'signUp':
        //console.log('creating profile')
        const newUser = { email: payload.data?.attributes.email }
        const newProfile: UserProfile = {
          id: constructUserProfileKey(newUser.email),
          noteTitles: [],
          username: newUser.email,
        }
        userController.setProfile(newProfile)
        await putUserProfile(newProfile)

        //console.log('profile created')
        break

      case 'signIn_failure':
        break
    }
  }

  useEffect(() => {
    let fn = async () => {
      if (userController.username) {
        return
      }

      try {
        let user = await Auth.currentAuthenticatedUser()
        if (user) {
          await userController.setIsLoggedIn(true)
          await userController.setUsername(user.attributes.email)
        }
      } catch (error) {
        await userController.setIsLoggedIn(false)
        await userController.setUsername(null)
        await userController.setProfile(null)
      }
    }

    fn()
  }, [userController.username])

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
  }, [])

  return (
    <>
      <Box justifyContent={'space-evenly'} display='flex'>
        {userController.username ? (
          <>
            <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />}>
              <Stack flexGrow={1}></Stack>
              <LoggedInUserMenu onLogOut={signOut} username={userController.username} />
            </Stack>
          </>
        ) : (
          <>
            <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />}>
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
