import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import WarmupBox from 'components/Atoms/WarmupBox'
import { useUserController } from 'hooks/userController'

const HomeMenu = () => {
  const userController = useUserController()

  const [isAdmin, setIsAdmin] = React.useState(false)
  const [isLoading, setIsloading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      if (user) {
        setIsAdmin(userHasRole('Admin', user.roles))
      } else {
        userController.setIsLoggedIn(false)
      }
      setIsloading(false)
    }
    fn()
  }, [userController.isLoggedIn])

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
            <Box py={2}>
              <Box>
                <CenterStack>
                  <InternalLink route={'/csr/news'} text={'news'} large />
                </CenterStack>
                <HorizontalDivider />
                <CenterStack>
                  <InternalLink route={'/csr/stocks'} text={'stocks'} large />
                </CenterStack>
                <HorizontalDivider />
                <CenterStack>
                  <InternalLink route={'/ssg/recipes'} text={'recipes'} large />
                </CenterStack>
                <HorizontalDivider />
                {userController.isLoggedIn && (
                  <>
                    <CenterStack>
                      <InternalLink route={'/protected/csr/goals'} text={'goals'} large />
                      <Typography>|</Typography>
                      <InternalLink route={'/protected/csr/notes'} text={'notes'} large />
                    </CenterStack>
                    <HorizontalDivider />

                    <CenterStack>
                      <InternalLink route={'/protected/csr/dashboard'} text={'dashboard'} large />
                    </CenterStack>
                    <HorizontalDivider />
                    <CenterStack>
                      <InternalLink route={'/protected/csr/secrets'} text={'secrets'} large />
                    </CenterStack>
                    <HorizontalDivider />
                    {isAdmin && (
                      <>
                        <CenterStack>
                          <InternalLink route={'/protected/csr/admin'} text={'admin'} large />
                        </CenterStack>
                        <HorizontalDivider />
                      </>
                    )}
                  </>
                )}
              </Box>
            </Box>
            <CenterStack>
              <InternalLink route={'/ssg/randomdogs'} text={'dogs'} large />
              <Typography>|</Typography>
              <InternalLink route={'/ssg/randomcats'} text={'cats'} large />
            </CenterStack>
            <HorizontalDivider />
          </Box>
          <CenterStack>
            <InternalLink route={'/ssg/coinflip'} text={'flip a coin'} large />
            <Typography>|</Typography>
            <InternalLink route={'/ssg/roulette'} text={'spin wheel'} large />
          </CenterStack>
        </Container>
      </Box>
    </Box>
  )
}

export default HomeMenu
