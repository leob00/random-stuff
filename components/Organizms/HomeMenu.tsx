import { Box, Container, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import React from 'react'
import router from 'next/router'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import { Divider } from '@aws-amplify/ui-react'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import { DarkBlueTransparent } from 'components/themes/mainTheme'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import InternalLink from 'components/Atoms/Buttons/InternalLink'

const HomeMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      setIsLoggedIn(user !== null)
      if (user) {
        //console.log(JSON.stringify(user.roles))
        //console.log('isAdmin: ', userHasRole(user.roles, 'Admin'))
        setIsAdmin(userHasRole('Admin', user.roles))
      }
    }
    fn()
  }, [isLoggedIn])

  return (
    <Box>
      <Box
        sx={{
          mt: 4,
          borderTopWidth: 3,
          //pt: 3,
          //pb: 3,
        }}
      >
        <Container>
          <CenteredHeader title={'Welcome to random stuff'} description={'You came to the right place to view random things. Enjoy!'} />

          <Box>
            <CenterStack>
              <InternalLink route={'/ssg/randomdogs'} text={'dogs'} />
              <InternalLink route={'/ssg/randomcats'} text={'cats'} />
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
          {isLoggedIn && (
            <Box py={2}>
              <HorizontalDivider />
              <CenteredTitle title='My Stuff' />
              <Box>
                <CenterStack>
                  <InternalLink route={'/protected/csr/dashboard'} text={'dashboard'} />
                  <InternalLink route={'/protected/csr/notes'} text={'notes'} />
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
