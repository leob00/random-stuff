'use client'
import { AppBar, Container, Toolbar, useScrollTrigger, Box, Stack, useTheme } from '@mui/material'
import { useRouter } from 'next/navigation'
import NLink from 'next/link'
import { useEffect, useState } from 'react'
import React from 'react'
import UserPanel from './UserPanel'
import { DarkMode } from './themes/DarkMode'
import logo from '/public/images/logo-with-text-blue-small.png'
import StaticImage from './Atoms/StaticImage'
import MenuLinkButton from './Atoms/Buttons/MenuLinkButton'
import GradientContainer from './Atoms/Boxes/GradientContainer'
import SiteLink from './app/server/Atoms/Links/SiteLink'
//
const Header = ({ colorTheme, onSetColorMode }: { colorTheme: 'light' | 'dark'; onSetColorMode: () => void }) => {
  const [elevationEffect, setElevationEffect] = useState(true)
  const router = useRouter()
  const theme = useTheme()

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
    <AppBar component='nav' sx={{ zIndex: theme.zIndex.drawer + 1 }} position={'sticky'} elevation={elevationEffect ? 4 : 0}>
      <GradientContainer>
        <DarkMode>
          <Toolbar>
            <Container sx={{ width: '100%', py: 1 }}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Box display='flex' gap={{ xs: 1, sm: 2 }}>
                  <NLink href='/' passHref>
                    <StaticImage image={logo} title='random things' width={120} height={60} priority={true} />
                  </NLink>
                  <Box pt={2}>
                    <Box display='flex' gap={{ xs: 1, sm: 2 }} alignItems={'center'}>
                      <Box>
                        <SiteLink href='/' text={'home'} />
                      </Box>
                      <Box>
                        <SiteLink href='/csr/news' text={'news'} />
                      </Box>
                      <Box sx={{ display: { xs: 'none', md: 'unset' } }}>
                        <SiteLink href='/ssg/recipes' text={'recipes'} />
                      </Box>
                      <Box sx={{ display: { xs: 'none', md: 'unset' } }}>
                        <SiteLink href='/csr/community-stocks' text={'stocks'} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box pt={'12px'}>
                  <Box display={'flex'} justifyContent={'flex-end'} flexDirection={'row-reverse'}>
                    <UserPanel palette={colorTheme} onChangePalette={handleChangeLightMode} />
                  </Box>
                </Box>
              </Box>
            </Container>
          </Toolbar>
        </DarkMode>
      </GradientContainer>
    </AppBar>
  )
}

export default Header
