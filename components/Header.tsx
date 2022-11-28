'use client'
import { AppBar, Button, Container, Toolbar, useScrollTrigger, Box, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import NLink from 'next/link'
import { useEffect, useState } from 'react'
import '@aws-amplify/ui-react/styles.css'
import React from 'react'
import UserLoginPanel from './UserLoginPanel'
import { DarkMode } from './themes/DarkMode'
import logo from '/public/images/logo-with-text-blue-small.png'
import StaticImage from './Atoms/StaticImage'
import MenuLinkButton from './Atoms/Buttons/MenuLinkButton'

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
  const [elevationEffect, setElevationEffect] = useState(true)
  const router = useRouter()

  const bodyScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  useEffect(() => {
    setElevationEffect(bodyScrolled)
  }, [bodyScrolled])
  return (
    <>
      <AppBar sx={{ backgroundColor: 'transparent' }} position='sticky' elevation={elevationEffect ? 4 : 0} className='blue-gradient'>
        <Toolbar>
          <Container sx={{ width: '100%', py: 1 }}>
            <Box>
              <Stack direction='row' spacing={{ xs: 1, sm: 2 }}>
                <DarkMode>
                  <NLink href='/' passHref>
                    <StaticImage image={logo} title='random things' width={120} height={60} priority={true} />
                  </NLink>
                  <Box display={'flex'} pt={4}>
                    <Stack direction='row' spacing={{ xs: 1, sm: 2 }}>
                      <Stack display={'flex'}>
                        <MenuLinkButton
                          text={'Home'}
                          onClicked={() => {
                            router.push('/')
                          }}
                        />
                      </Stack>
                      <Stack display={{ xs: 'none', sm: 'flex' }}>
                        <MenuLinkButton
                          text={'About'}
                          onClicked={() => {
                            router.push('/ssg/About')
                          }}
                        />
                      </Stack>
                      <Stack>
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
