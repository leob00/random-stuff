'use client'
import React from 'react'
import { AppBar, Box, Container, CssBaseline, Stack, ThemeProvider, Toolbar, useScrollTrigger } from '@mui/material'
import { DarkMode } from 'components/themes/DarkMode'
import GradientContainer from 'components/Atoms/Boxes/GradientContainer'
import NLink from 'next/link'
import StaticImage from 'components/Atoms/StaticImage'
import logo from '/public/images/logo-with-text-blue-small.png'
import MenuLinkButton from 'components/Atoms/Buttons/MenuLinkButton'
import { useRouter } from 'next/navigation'
const AppHeader = () => {
  const router = useRouter()

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
                    </Stack>
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
