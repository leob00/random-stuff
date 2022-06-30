import { AppBar, Button, Container, Grid, Toolbar, useScrollTrigger, Link, Box, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import Image from 'next/image'
import NLink from 'next/link'
import { useEffect, useState } from 'react'
import { withAuthenticator, Button as LoginButton, Heading } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Auth, Hub } from 'aws-amplify'
import { Person } from '@mui/icons-material'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { HubPayload } from '@aws-amplify/core'
import React from 'react'
import UserLogin from './UserLoginPanel'

// This is used to make the header stick to the top
function ElevationScroll({ children }: { children: React.ReactElement<any> }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | null>(null)
  const [elevationEffect, setElevationEffect] = useState(false)

  const bodyScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  const signOut = async () => {
    Auth.signOut()
  }

  useEffect(() => {
    setElevationEffect(bodyScrolled)
  }, [bodyScrolled])
  return (
    <>
      <AppBar sx={{ backgroundColor: 'transparent' }} position='sticky' elevation={elevationEffect ? 4 : 0} className='blue-gradient'>
        <Toolbar>
          <Container sx={{ width: '100%', my: 1 }}>
            <Grid container alignItems='center' columns={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }} spacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
              <Grid
                item
                sx={{
                  flexGrow: 0.1,
                  display: {
                    xs: 'block',
                    sm: 'block',
                    md: 'block',
                    lg: 'block',
                    xl: 'block',
                  },
                }}>
                <NLink href='/' passHref>
                  <Link sx={{}} href='/'>
                    <Image priority src='/images/logo-with-text.png' width={161} height={70} alt='random things' style={{ borderRadius: '.6rem' }} placeholder='empty' />
                  </Link>
                </NLink>
              </Grid>
              {/* <Grid>
                <Grid item>
                  <Heading level={1}>Hello {Auth.userSession.name}</Heading>
                  <LoginButton onClick={signOut}>Sign out</LoginButton>
                </Grid>
              </Grid> */}
              {/*  <Grid
                item
                sx={{
                  flexGrow: 0.1,
                  display: {
                    xs: 'block',
                    sm: 'block',
                    md: 'block',
                    lg: 'block',
                    xl: 'block',
                  },
                }}>
                <Button
                  onClick={() => {
                    router.push('/ssg/About')
                  }}
                  sx={{ color: 'whitesmoke' }}
                  variant='text'>
                  About
                </Button>
              </Grid> */}
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
      <UserLogin />
    </>
  )
}

export default Header
