import * as React from 'react'
import { AppBar, Box, Button, Container, Grid, IconButton, InputAdornment, Menu, MenuItem, TextField, Toolbar, useScrollTrigger } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import { isLoggedIn } from 'lib/auth'
import useRouter from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

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

const Header = ({ home }: { home?: boolean }) => {
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | null>(null)
  const router = useRouter
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  /**
   * TODO: When the below is uncommented, it enters an infinite loop
   * @param {} location
   */
  const handleMenuClick = (location: string) => {
    setAnchorEl(null)
    router.push(location)
  }

  return (
    <ElevationScroll>
      <Container>
        <AppBar sx={{ backgroundColor: '#141a20' }}>
          <Toolbar>
            <Container sx={{ paddingTop: '10px' }}>
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
                  <Link href='/'>
                    <a>
                      <Image priority src='/images/logo-with-text.png' width={151} height={60} alt='random things' style={{ borderRadius: '.6rem' }} />
                    </a>
                  </Link>
                </Grid>
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
                  <Button
                    onClick={() => {
                      router.push('/')
                    }}
                    sx={{ color: 'whitesmoke' }}
                    variant='text'>
                    Home
                  </Button>
                </Grid>
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
                  <Button
                    onClick={() => {
                      router.push('/ssg/About')
                    }}
                    sx={{ color: 'whitesmoke' }}
                    variant='text'>
                    About
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Toolbar>
        </AppBar>
      </Container>
    </ElevationScroll>
  )
}

export default Header
