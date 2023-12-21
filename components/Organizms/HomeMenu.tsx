import { Box, Container, Paper, Typography } from '@mui/material'
import React from 'react'
import CenterStack from 'components/Atoms/CenterStack'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { useUserController } from 'hooks/userController'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'

const HomeMenu = () => {
  const { ticket, setTicket } = useUserController()
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      if (user) {
        setIsAdmin(userHasRole('Admin', user.roles))
      } else {
        setTicket(null)
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])

  return (
    <Box>
      <Box
        sx={{
          mt: 4,
          borderTopWidth: 3,
        }}
      >
        <CenteredHeader title={'Welcome to random stuff'} description={'You came to the right place to view random things. Enjoy!'} />
        <Box pb={8}>
          <Box py={2}>
            <Paper>
              <CenteredNavigationButton route={'/csr/news'} text={'news'} />
              <CenteredNavigationButton route={'/ssg/recipes'} text={'recipes'} />
              <CenteredNavigationButton route={'/csr/stocks'} text={'stocks'} />
              <CenteredNavigationButton route={'/ssg/community-stocks'} text={'community stocks'} />
              <CenteredNavigationButton route={'/csr/stocks/stock-porfolios'} text={'stock portfolios'} />
              {ticket && (
                <>
                  <CenteredNavigationButton route={'/protected/csr/goals'} text={'goals'} />
                  <CenteredNavigationButton route={'/protected/csr/notes'} text={'notes'} />
                  <CenteredNavigationButton route={'/protected/csr/dashboard'} text={'dashboard'} />
                  <CenteredNavigationButton route={'/protected/csr/secrets'} text={'secrets'} />
                  {isAdmin && <CenteredNavigationButton route={'/protected/csr/admin'} text={'admin'} />}
                </>
              )}
              <CenteredNavigationButton route={'/csr/calculator'} text={'calculator'} />
              <CenteredNavigationButton route={'/ssg/coin-flip'} text={'coin flip'} />
              <CenteredNavigationButton route={'/ssg/roulette'} text={'roulette'} />
              <CenteredNavigationButton route={'/ssg/randomdogs'} text={'dogs'} />
              <CenteredNavigationButton route={'/ssg/randomcats'} text={'cats'} />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HomeMenu
