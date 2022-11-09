import { Person } from '@mui/icons-material'
import { Stack, Button } from '@mui/material'
import { Auth, Hub } from 'aws-amplify'
import { useUserController } from 'hooks/userController'
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

const UserLoginPanel = () => {
  //const authStore = useAuthStore()
  const userController = useUserController()
  const signOut = () => {
    const fn = async () => {
      await Auth.signOut()
    }

    fn()
  }

  const updateUser = async (payload: HubPayload) => {
    switch (payload.event) {
      case 'signOut':
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
        console.log('user roles: ', user.roles)
        if (user.roles) {
        }
        //console.log(payload.data?.attributes['custom:roles'])
        //await userController.setLastProfileFetchDate('')
        router.push('/ssg/waitandredirect?id=protected/csr/dashboard')
        break
      case 'signUp':
        //console.log('creating profile')
        const newUser = { email: payload.data?.attributes.email }
        const newProfile: UserProfile = {
          id: constructUserProfileKey(newUser.email),
          noteTitles: [],
          username: newUser.email,
        }
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
        updateUser(payload)

        //console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event)
      })
    }

    fn()
  }, [])

  return (
    <>
      {userController.username ? (
        <>
          <LoggedInUserMenu onLogOut={signOut} username={userController.username} />
        </>
      ) : (
        <>
          <Button onClick={handleLoginClick} size='small' sx={{}}>
            <Person fontSize='small' />
            login
          </Button>
        </>
      )}
    </>
  )
}

export default UserLoginPanel
