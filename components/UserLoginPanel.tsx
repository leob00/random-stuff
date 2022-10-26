import { Person } from '@mui/icons-material'

import { Stack, Button } from '@mui/material'

import { Auth, Hub } from 'aws-amplify'

import { UserProfile } from 'lib/backend/api/aws/apiGateway'

import { constructUserProfileKey } from 'lib/backend/api/aws/util'

import { useAuthStore } from 'lib/backend/auth/useAuthStore'

import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'

import router from 'next/router'

import React, { useEffect } from 'react'

import LoggedInUserMenu from './LoggedInUserMenu'

import { DarkMode } from './themes/DarkMode'

export type HubPayload = {
  event: string

  data?: any

  message?: string
}

const UserLogin = () => {
  const authStore = useAuthStore()

  const signOut = () => {
    const fn = async () => {
      await Auth.signOut()
    }

    fn()
  }

  const updateUser = async (payload: HubPayload) => {
    switch (payload.event) {
      case 'signOut':
        authStore.setIsLoggedIn(false)

        authStore.setUsername(null)

        router.push('/login')

        break

      case 'signIn':
        const user = { email: payload.data?.attributes.email }

        authStore.setIsLoggedIn(true)

        authStore.setUsername(user.email)

        router.push('/ssg/waitandredirect?id=protected/csr/userdashboard')

        break

      case 'signUp':
        console.log('creating profile')

        const newUser = { email: payload.data?.attributes.email }

        const newProfile: UserProfile = {
          id: constructUserProfileKey(newUser.email),

          noteTitles: [],
        }

        await putUserProfile(newProfile)

        console.log('profile created')

        break

      case 'signIn_failure':
        break
    }
  }

  useEffect(() => {
    let fn = async () => {
      if (authStore.isLoggedIn && authStore.username) {
        console.log('user logged in: ', authStore.username)

        return
      }

      try {
        let user = await Auth.currentAuthenticatedUser()

        if (user) {
          authStore.setIsLoggedIn(true)

          authStore.setUsername(user.attributes.email)
        }
      } catch (error) {
        authStore.setIsLoggedIn(false)
      }
    }

    fn()
  }, [authStore.isLoggedIn])

  const handleLoginClick = async () => {
    router.push('/login')
  }

  useEffect(() => {
    let fn = async () => {
      Hub.listen('auth', (data) => {
        const { payload } = data

        updateUser(payload)

        //console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event)
      })
    }

    fn()
  }, [])

  return (
    <>
      <DarkMode>
        <Stack>
          {authStore.isLoggedIn === true && authStore.username ? (
            <>
              <LoggedInUserMenu onLogOut={signOut} username={authStore.username} />
            </>
          ) : (
            <>
              <Button onClick={handleLoginClick} size='small' sx={{}}>
                <Person fontSize='small' />
                login
              </Button>
            </>
          )}
        </Stack>
      </DarkMode>
    </>
  )
}

export default UserLogin
