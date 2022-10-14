import { Box, Container, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { getUserSSR } from 'lib/backend/server-side/serverSideAuth'
import { GetServerSideProps, NextPage } from 'next'
import router from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
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
const Protected: NextPage<{ authenticated: boolean; username: string | undefined }> = ({ authenticated, username }) => {
  return (
    <>
      <Container>
        {!authenticated ? (
          <Typography variant='h6'>
            <Box sx={{ my: 4 }}>
              <CenteredHeader title={''} description={'Sorry! Looks like you are not signed in.'}></CenteredHeader>
              <Box sx={{ my: 4, textAlign: 'center' }}>
                <PrimaryButton
                  text='sign in'
                  onClicked={() => {
                    router.push('/login')
                  }}
                />
              </Box>
            </Box>
          </Typography>
        ) : (
          <Typography variant='body1'>{`Welcome back, ${username?.substring(0, username.indexOf('@'))}!`}</Typography>
        )}
      </Container>
    </>
  )
}

export default Protected
