import { Person } from '@mui/icons-material'
import { Stack, Button } from '@mui/material'
import { Auth, Hub } from 'aws-amplify'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { getUserProfile, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { ApiError } from 'next/dist/server/api-utils'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import LoggedInUserMenu from './LoggedInUserMenu'
import { DarkMode } from './themes/DarkMode'

export type HubPayload = {
  event: string
  data?: any
  message?: string
}

const UserLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  const signOut = () => {
    const fn = async () => {
      await Auth.signOut()
    }
    fn()
  }

  const updateUser = async (payload: HubPayload) => {
    //console.log(JSON.stringify(user))
    switch (payload.event) {
      case 'signOut':
        setIsLoggedIn(false)
        router.push('/')
        setUsername('')
        break
      case 'signIn':
        const user = { email: payload.data?.attributes.email }
        setIsLoggedIn(true)
        setUsername(user.email)
        let profile = await getUserProfile(user.email)
        if (profile instanceof ApiError) {
          console.log('error in getting user profile: ', JSON.stringify(profile))
          return
        }
        router.push('/protected/csr')
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
      try {
        let user = await Auth.currentAuthenticatedUser()
        if (user) {
          setIsLoggedIn(true)
          setUsername(user.attributes.email)
        }
      } catch (error) {
        setIsLoggedIn(false)
      } finally {
        //router.push('/')
      }
    }
    fn()
  }, [isLoggedIn])

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
          {isLoggedIn === true ? (
            <>
              <LoggedInUserMenu onLogOut={signOut} username={username} />
            </>
          ) : (
            <>
              <Button onClick={handleLoginClick}>
                <Person />
                sign in
              </Button>
            </>
          )}
        </Stack>
      </DarkMode>
    </>
  )
}

export default UserLogin
