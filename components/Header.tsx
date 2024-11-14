'use client'
import { AppBar, Container, Toolbar, useScrollTrigger, Box, useTheme } from '@mui/material'
import NLink from 'next/link'
import { useEffect, useState } from 'react'
import UserPanel from './UserPanel'
import { DarkMode } from './themes/DarkMode'
import logo from '/public/images/logo-with-text-blue-small.png'
import StaticImage from './Atoms/StaticImage'
import GradientContainer from './Atoms/Boxes/GradientContainer'
import { useUserController } from 'hooks/userController'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import HeaderLinks from './HeaderLinks'
//
const Header = ({ colorTheme, onSetColorMode }: { colorTheme: 'light' | 'dark'; onSetColorMode: () => void }) => {
  const [elevationEffect, setElevationEffect] = useState(false)
  const theme = useTheme()
  const { ticket, setTicket } = useUserController()

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
  useEffect(() => {
    let fn = async () => {
      if (ticket) {
        return
      }

      try {
        let user = await getUserCSR()
        await setTicket(user)
      } catch (error) {
        await setTicket(null)
      }
    }

    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])

  return (
    <AppBar component='nav' sx={{ zIndex: theme.zIndex.drawer + 1 }} position={'sticky'} elevation={elevationEffect ? 6 : 0}>
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
                    <HeaderLinks />
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
