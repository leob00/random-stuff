'use client'
import { AppBar, Box, Container, CssBaseline, Stack, ThemeProvider, Toolbar, useScrollTrigger } from '@mui/material'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import React, { ReactNode, useEffect, useState } from 'react'
import awsconfig from '../src/aws-exports'
import { Amplify } from 'aws-amplify'
import darkTheme from 'components/themes/darkTheme'
import theme from 'components/themes/mainTheme'
import { useRouter } from 'next/navigation'
import { DarkMode } from 'components/themes/DarkMode'
import NLink from 'next/link'
import StaticImage from 'components/Atoms/StaticImage'
import logo from '/public/images/logo-with-text-blue-small.png'
import MenuLinkButton from 'components/Atoms/Buttons/MenuLinkButton'
import '../styles/globals.css'

Amplify.configure({ ...awsconfig, ssr: true })
const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : theme
}
const AppLayout = ({ children }: { children: ReactNode }) => {
  const sessionSettings = useSessionSettings()
  const [colorMode, setColorMode] = React.useState<'dark' | 'light'>('dark')

  useEffect(() => {
    sessionSettings.savePalette(colorMode)
    setColorMode(sessionSettings.palette)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionSettings.palette, colorMode])

  const handleChangeColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    setColorMode(newMode)
    sessionSettings.savePalette(newMode)
  }
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
      {/* <Header onSetColorMode={handleChangeColorMode} colorTheme={colorMode} /> */}

      <ThemeProvider theme={getTheme(colorMode)}>
        <CssBaseline />
        <AppBar sx={{ backgroundColor: 'transparent' }} position='sticky' elevation={elevationEffect ? 4 : 0} className='blue-gradient'>
          <Toolbar>
            <Container sx={{ width: '100%', py: 1 }}>
              <Box>
                <Stack direction='row' spacing={{ xs: 1, sm: 2 }} justifyItems={'center'}>
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
                        {/* <Stack>
                          <UserPanel palette={colorTheme} onChangePalette={handleChangeLightMode} />
                        </Stack> */}
                      </Stack>
                    </Box>
                  </DarkMode>
                </Stack>
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  )
}

export default AppLayout
