'use client'
import { AppBar, Container, Toolbar, useScrollTrigger, Box, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'
import NLink from 'next/link'
import { useEffect, useState } from 'react'
//import '@aws-amplify/ui-react/styles.css'
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

const Header = ({ colorTheme, onSetColorMode }: { colorTheme: 'light' | 'dark'; onSetColorMode: () => void }) => {
  const [elevationEffect, setElevationEffect] = useState(true)
  const router = useRouter()

  const bodyScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  useEffect(() => {
    setElevationEffect(bodyScrolled)
  }, [bodyScrolled])

  const handleChangeLightMode = () => {
    onSetColorMode()
  }

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
                  <Box pt={4}>
                    <Stack direction='row' spacing={{ xs: 1, sm: 2 }} alignItems={'center'}>
                      <Stack display={{ xs: 'none', sm: 'flex' }}>
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
                        <UserLoginPanel palette={colorTheme} onChangePalette={handleChangeLightMode} />
                      </Stack>
                      {/* <Stack>
                        <Box pl={4}>
                          <IconButton size='small' onClick={handleChangeLightMode}>
                            {colorTheme === 'light' ? <DarkModeIcon fontSize='small' /> : <LightModeIcon fontSize='small' />}
                          </IconButton>
                        </Box>
                      </Stack> */}
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
