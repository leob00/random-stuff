import { Person } from '@mui/icons-material'
import { Container, Grid, Stack, Link, Button, Box } from '@mui/material'
import { Auth, Hub } from 'aws-amplify'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import NLink from 'next/link'
import { withAuthenticator, Button as LoginButton, Heading } from '@aws-amplify/ui-react'
import LoggedInUserMenu from './LoggedInUserMenu'
import { DarkMode } from './themes/DarkMode'
import axios, { AxiosRequestConfig } from 'axios'

export type HubPayload = {
  event: string
  data?: any
  message?: string
}

const UserLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const signOut = () => {
    const fn = async () => {
      await Auth.signOut()
      //setIsLoggedIn(false)
      //router.push('/')
    }
    fn()
  }

  const updateUser = (payload: HubPayload) => {
    //console.log(JSON.stringify(payload))
    switch (payload.event) {
      case 'signOut':
        setIsLoggedIn(false)
        router.push('/')
        break
      case 'signIn':
        setIsLoggedIn(true)
        //api/login()
        router.push('/protected')
        break
    }
  }
  useEffect(() => {
    let fn = async () => {
      try {
        let user = await Auth.currentAuthenticatedUser()
        setIsLoggedIn(user !== undefined)
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
        <Stack direction='row' justifyContent='right' textAlign='right'>
          {isLoggedIn === true ? (
            <>
              <LoggedInUserMenu onLogOut={signOut} />
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
