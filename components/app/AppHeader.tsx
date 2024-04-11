'use client'
import React from 'react'
import { AppBar, Box, Container, Stack, Toolbar, useScrollTrigger, useTheme } from '@mui/material'
import { DarkMode } from 'components/themes/DarkMode'
import GradientContainer from 'components/Atoms/Boxes/GradientContainer'
import NLink from 'next/link'
import StaticImage from 'components/Atoms/StaticImage'
import logo from '/public/images/logo-with-text-blue-small.png'
import SiteLink from './server/Atoms/Links/SiteLink'
import AppUserPanel from './AppUserPanel'
import amplifyConfig from 'src/amplifyconfiguration.json'
import { Amplify } from 'aws-amplify'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
Amplify.configure(amplifyConfig, { ssr: true })
const AppHeader = ({ handleChangePalette }: { handleChangePalette: () => void }) => {
  const theme = useTheme()
  const { palette, savePalette } = useSessionSettings()
  const [colorMode, setColorMode] = React.useState<'light' | 'dark'>('dark')

  const bodyScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })
  const [elevationEffect, setElevationEffect] = React.useState(true)
  React.useEffect(() => {
    setElevationEffect(bodyScrolled)
  }, [bodyScrolled])

  return (
    <AppBar sx={{ backgroundColor: 'transparent' }} position='sticky' elevation={elevationEffect ? 4 : 0} className='blue-gradient'>
      <GradientContainer>
        <Toolbar>
          <Container sx={{ width: '100%', py: 1 }}>
            <Box>
              <Stack direction='row' spacing={{ xs: 1, sm: 2 }} justifyItems={'center'}>
                <DarkMode>
                  <NLink href='/' passHref>
                    <StaticImage image={logo} title='random things' width={120} height={60} priority={true} />
                  </NLink>
                  <Box pt={2}>
                    <Stack direction='row' spacing={{ xs: 1, sm: 2 }} alignItems={'center'}>
                      <Stack display={{ xs: 'flex', sm: 'flex' }}>
                        <SiteLink href='/' text={'home'} />
                      </Stack>
                      <Stack display={{ xs: 'flex', sm: 'flex' }}>
                        <SiteLink href='/ssg/About' text={'about'} />
                      </Stack>
                    </Stack>
                  </Box>
                  <Box pt={'12px'}>
                    <AppUserPanel palette={theme.palette.mode} onChangePalette={handleChangePalette} />
                  </Box>
                </DarkMode>
              </Stack>
            </Box>
          </Container>
        </Toolbar>
      </GradientContainer>
    </AppBar>
  )
}

export default AppHeader
