import { Box, Container } from '@mui/material'
import React from 'react'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import WarmupBox from 'components/Atoms/WarmupBox'

const HomeMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [isLoading, setIsloading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      setIsLoggedIn(user !== null)
      if (user) {
        setIsAdmin(userHasRole('Admin', user.roles))
      }
      setIsloading(false)
    }
    fn()
  }, [isLoggedIn])

  return (
    <Box>
      <Box
        sx={{
          mt: 4,
          borderTopWidth: 3,
        }}
      >
        <Container>
          <CenteredHeader title={'Welcome to random stuff'} description={'You came to the right place to view random things. Enjoy!'} />

          <Box>
            <CenterStack>
              <InternalLink route={'/ssg/randomdogs'} text={'dogs'} />
              <InternalLink route={'/ssg/randomcats'} text={'cats'} />
            </CenterStack>
            <CenterStack>
              <InternalLink route={'/ssg/recipes'} text={'recipes'} />
            </CenterStack>
          </Box>
          <CenterStack>
            <InternalLink route={'/ssg/coinflip'} text={'flip coin'} />
            <InternalLink route={'/ssg/roulette'} text={'spin wheel'} />
          </CenterStack>
          <CenterStack>
            <InternalLink route={'/csr/news'} text={'news'} />
          </CenterStack>
          <CenterStack>
            <InternalLink route={'/csr/stocks'} text={'stocks'} />
          </CenterStack>
          {isLoading && <WarmupBox text='loading user menu...' />}
          {isLoggedIn && (
            <Box py={2}>
              <HorizontalDivider />
              <CenteredTitle title='My Stuff' />
              <Box>
                <CenterStack>
                  <InternalLink route={'/protected/csr/dashboard'} text={'dashboard'} />
                  <InternalLink route={'/protected/csr/notes'} text={'notes'} />
                  <InternalLink route={'/protected/csr/goals'} text={'goals'} />
                </CenterStack>
              </Box>
              <Box>
                <CenterStack>
                  <InternalLink route={'/protected/csr/secrets'} text={'secrets'} />
                </CenterStack>
              </Box>
              {isAdmin && (
                <Box>
                  <CenterStack>
                    <InternalLink route={'/protected/csr/admin'} text={'admin'} />
                  </CenterStack>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}

export default HomeMenu
