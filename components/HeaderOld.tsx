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

const HeaderOld = ({ home }: { home?: boolean }) => {
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
            <Container>
              <Grid container columns={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }} justifyContent='space-between' alignItems='center'>
                <Grid item>
                  <Grid container alignItems='left' spacing={1}>
                    <Grid
                      item
                      sx={{
                        flexGrow: 1,
                        display: {
                          xs: 'block',
                          sm: 'block',
                          md: 'block',
                          lg: 'none',
                          xl: 'none',
                        },
                      }}>
                      <Box>
                        <IconButton id='nav-button' color='secondary' onClick={handleClick}>
                          <MenuIcon />
                        </IconButton>
                        <Menu
                          id='nav-menu'
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'nav-button',
                          }}>
                          <MenuItem
                            onClick={() => {
                              handleMenuClick('/')
                            }}>
                            Home
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Grid>
                    {/*  <Grid item>
                      <Grid alignItems='left'>
                        <Grid
                          item
                          sx={{
                            flexGrow: 1,
                            mt: 1,
                            display: {
                              xs: 'none',
                              sm: 'none',
                              md: 'none',
                              lg: 'block',
                              xl: 'block',
                            },
                          }}>
                          <Link href='/'>
                            <a>
                              <Image priority src='/images/logo.png' width={151} height={60} alt='random things' style={{ borderRadius: '.8rem' }} />
                            </a>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid> */}
                  </Grid>
                </Grid>

                <Grid
                  alignItems='left'
                  item
                  sx={{
                    flexGrow: 1,
                    display: {
                      xs: 'none',
                      sm: 'none',
                      md: 'none',
                      lg: 'block',
                      xl: 'block',
                    },
                  }}>
                  <Grid container justifyContent='space-evenly' alignItems='left' columns={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                    <Grid item>
                      <Button
                        sx={{ color: 'whitesmoke' }}
                        onClick={() => {
                          router.push('/')
                        }}
                        //color="secondary"
                        variant='text'>
                        Home
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        //onClick={() => { router.push("/clientFetch") }}
                        //color="secondary"
                        sx={{ color: 'whitesmoke' }}
                        variant='text'>
                        About
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container alignItems='center' columns={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }} spacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
                    <Grid
                      item
                      sx={{
                        flexGrow: 1,
                        display: {
                          xs: 'none',
                          sm: 'block',
                          md: 'block',
                          lg: 'block',
                          xl: 'block',
                        },
                      }}>
                      {/*  <TextField
                    color='secondary'
                    size='small'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}></TextField> */}
                    </Grid>

                    <Grid item>
                      {isLoggedIn() ? (
                        <>
                          <Button
                            variant='outlined'
                            onClick={() => {
                              router.push('/dashboard/profile')
                            }}>
                            My Account
                          </Button>
                        </>
                      ) : (
                        <>
                          {/*  <Button
                        variant='contained'
                        onClick={() => {
                          router.push('/dashboard/login')
                        }}>
                        Sign In
                      </Button> */}
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </Toolbar>
        </AppBar>
      </Container>
    </ElevationScroll>
  )
}

export default HeaderOld
