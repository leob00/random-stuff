import { AppBar, Button, Container, Grid, Toolbar, useScrollTrigger, Link, Box, Divider, Stack } from '@mui/material'
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
          <Container sx={{ width: '100%', py: 1 }}>
            <Box>
              <Stack direction='row' spacing={1}>
                <DarkMode>
                  <NLink href='/' passHref>
                    <RemoteImage url='/images/logo-with-text-blue-small.png' title='random things' width={150} height={76} priority={true} />
                  </NLink>
                  <Box display={'flex'} pt={7}>
                    <Stack direction='row' spacing={1}>
                      <Stack display={'flex'}>
                        <Button
                          size={'small'}
                          onClick={() => {
                            router.push('/')
                          }}
                        >
                          Home
                        </Button>
                      </Stack>
                      <Stack display={{ xs: 'none', sm: 'flex' }}>
                        <Button
                          size='small'
                          onClick={() => {
                            router.push('/ssg/About')
                          }}
                        >
                          About
                        </Button>
                      </Stack>
                      <Stack display={'flex'}>
                        <UserLoginPanel />
                      </Stack>
                    </Stack>
                  </Box>
                </DarkMode>
              </Stack>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
