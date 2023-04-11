import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import CenterStack from 'components/Atoms/CenterStack'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { useUserController } from 'hooks/userController'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'

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
        userController.setTicket(null)
      }
      setIsloading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

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
              <CenteredNavigationButton route={'/csr/news'} text={'news'} />
              <CenteredNavigationButton route={'/csr/stocks'} text={'stocks'} />
              <CenteredNavigationButton route={'/ssg/recipes'} text={'recipes'} />
              {userController.ticket && (
                <>
                  <CenterStack sx={{ py: 2 }}>
                    <NavigationButton route={'/protected/csr/goals'} text={'goals'} />
                    <Typography>|</Typography>
                    <NavigationButton route={'/protected/csr/notes'} text={'notes'} />
                  </CenterStack>
                  <HorizontalDivider />
                  <CenteredNavigationButton route={'/protected/csr/dashboard'} text={'dashboard'} />
                  <CenteredNavigationButton route={'/protected/csr/secrets'} text={'secrets'} />
                  {isAdmin && <CenteredNavigationButton route={'/protected/csr/admin'} text={'admin'} />}
                </>
              )}
            </Box>
            <CenterStack sx={{ py: 2 }}>
              <NavigationButton route={'/ssg/randomdogs'} text={'dogs'} />
              <Typography>|</Typography>
              <NavigationButton route={'/ssg/randomcats'} text={'cats'} />
            </CenterStack>
            <HorizontalDivider />
            <CenterStack sx={{ py: 2 }}>
              <NavigationButton route={'/ssg/coinflip'} text={'flip a coin'} />
              <Typography>|</Typography>
              <NavigationButton route={'/ssg/roulette'} text={'spin wheel'} />
            </CenterStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomeMenu
