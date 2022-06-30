import { Person } from '@mui/icons-material'
import { Container, Grid, Stack, Link, Button, Box } from '@mui/material'
import { Auth, Hub } from 'aws-amplify'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import NLink from 'next/link'
import { withAuthenticator, Button as LoginButton, Heading } from '@aws-amplify/ui-react'
import LoggedInUserMenu from './LoggedInUserMenu'

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

  const updateUser = async (payload: HubPayload) => {
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
        router.push('/')
      }
    }
    fn()
  }, [isLoggedIn])

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
    <Box>
      <Container>
        <Grid container alignItems='right' sx={{ paddingRight: 3 }} columns={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }} spacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
          <Grid item xs={6}></Grid>
          <Grid item xs={3}>
            <Stack direction='row' justifyContent='right'>
              {isLoggedIn === true ? (
                <>
                  <LoggedInUserMenu onLogOut={signOut} />
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      router.push('/login')
                    }}>
                    <Person />
                    sign in
                  </Button>
                </>
              )}
            </Stack>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default UserLogin
