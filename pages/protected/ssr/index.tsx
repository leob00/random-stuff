import { Box, Container, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { getUserSSR } from 'lib/backend/server-side/serverSideAuth'
import { GetServerSideProps, NextPage } from 'next'
import router from 'next/router'

interface PageProps {
  authenticated: boolean
  username?: string
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const user = await getUserSSR(context)
  if (user) {
    return {
      props: {
        authenticated: true,
        username: user.email,
      },
    }
  }

  return {
    props: {
      authenticated: false,
    },
  }
}
const Protected: NextPage<PageProps> = ({ authenticated, username }) => {
  const renderNotLoggedIn = () => {
    return <PleaseLogin />
  }
  return (
    <>
      <Container>
        {!authenticated ? (
          renderNotLoggedIn()
        ) : (
          <Box sx={{ py: 2 }}>
            <CenteredHeader title={`Welcome back, ${username?.substring(0, username.indexOf('@'))}!`} description={'what would you like to do?'} />
            <UserDashboardLayout username={username} />
          </Box>
        )}
      </Container>
    </>
  )
}

export default Protected
