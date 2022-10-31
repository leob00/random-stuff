import { Box, Container, Paper, Typography, Grid, List, ListItem, Link, Stack } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import NLink from 'next/link'
import React from 'react'
import router from 'next/router'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import { Divider } from '@aws-amplify/ui-react'
import { getUserCSR } from 'lib/backend/auth/userUtil'

const HomeMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      setIsLoggedIn(user !== null)
    }
    fn()
  }, [isLoggedIn])

  return (
    <>
      <Box
        sx={{
          mt: 4,
          borderTopWidth: 3,
          //pt: 3,
          //pb: 3,
        }}
      >
        <Container>
          <CenterStack sx={{ my: 2 }}>
            <Typography variant='h5' align='center' gutterBottom>
              Welcome to random stuff
            </Typography>
          </CenterStack>
          <CenterStack sx={{ my: 2 }}>
            <Typography variant='body2' align='center'>
              You came to the right place to view random things. Enjoy!
            </Typography>
          </CenterStack>
          <Box>
            <CenterStack>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/randomdogs')
                }}
              >
                dogs
              </LinkButton>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/randomcats')
                }}
              >
                cats
              </LinkButton>
            </CenterStack>
            {/* <CenterStack>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/articles')
                }}
              >
                blogs
              </LinkButton>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/waitandredirect?id=csr/DailySilliness')
                }}
              >
                daily silliness
              </LinkButton>
            </CenterStack> */}
            <CenterStack>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/recipes')
                }}
              >
                recipes
              </LinkButton>
            </CenterStack>
          </Box>
          <CenterStack>
            <LinkButton
              onClick={() => {
                router.push('/ssg/coinflip')
              }}
            >
              flip coin
            </LinkButton>
            <LinkButton
              onClick={() => {
                router.push('/ssg/roulette')
              }}
            >
              spin wheel
            </LinkButton>
          </CenterStack>
          <CenterStack>
            <LinkButton
              onClick={() => {
                router.push('/csr/news')
              }}
            >
              news
            </LinkButton>
            <LinkButton
              onClick={() => {
                router.push('/csr/newsfeed')
              }}
            >
              news feed
            </LinkButton>
          </CenterStack>
          {isLoggedIn && (
            <Box py={2}>
              <Divider />
              <CenterStack sx={{ py: 2 }}>
                <CenteredTitle title='My Stuff' />
              </CenterStack>
              <Box>
                <CenterStack>
                  <LinkButton
                    onClick={() => {
                      router.push('/protected/csr/dashboard')
                    }}
                  >
                    dashboard
                  </LinkButton>
                  <LinkButton
                    onClick={() => {
                      router.push('/protected/csr/notes')
                    }}
                  >
                    notes
                  </LinkButton>
                </CenterStack>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}

export default HomeMenu
