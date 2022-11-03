import { AppBar, Button, Container, Grid, Toolbar, useScrollTrigger, Link, Box } from '@mui/material'
import router from 'next/router'
import NLink from 'next/link'
import { useEffect, useState } from 'react'
import '@aws-amplify/ui-react/styles.css'
import { Auth } from 'aws-amplify'
import React from 'react'
import UserLoginPanel from './UserLoginPanel'
import { DarkMode } from './themes/DarkMode'
import RemoteImage from './Atoms/RemoteImage'

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
            <Grid container alignItems='center' columns={{ xs: 1, sm: 4, md: 8, lg: 12, xl: 12 }} spacing={{ xs: 0.02, sm: 1, md: 3, lg: 4, xl: 4 }}>
              <Grid item>
                <NLink href='/' passHref>
                  <RemoteImage url='/images/logo-with-text-blue-small.png' title='random things' width={150} height={76} priority={true} />
                </NLink>
              </Grid>
              <Grid item>
                <DarkMode>
                  <Button
                    // sx={{ fontStyle: 'italic' }}
                    size={'small'}
                    onClick={() => {
                      router.push('/')
                    }}
                  >
                    Home
                  </Button>
                </DarkMode>
              </Grid>
              <Grid item display={{ xs: 'none', sm: 'block' }}>
                <DarkMode>
                  <Button
                    // sx={{ fontStyle: 'italic' }}
                    size='small'
                    onClick={() => {
                      router.push('/ssg/About')
                    }}
                  >
                    About
                  </Button>
                </DarkMode>
              </Grid>
            </Grid>
            <Box display='flex' alignItems='justify-start' justifyContent='flex-end' sx={{ marginTop: -4.5 }}>
              <UserLoginPanel />
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
