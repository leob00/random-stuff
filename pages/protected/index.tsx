import { Box, Container, Typography } from '@mui/material'
import { withSSRContext } from 'aws-amplify'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import { hello, LambdaResponse } from 'lib/backend/api/aws/apiGateway'
import { getLoggedinUser } from 'lib/backend/auth/userUtil'
import { GetServerSideProps, NextPage } from 'next'
import router from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Auth } = withSSRContext(context)
  try {
    const user = await Auth.currentAuthenticatedUser()
    let email = user.attributes.email as string
    //const resp = await hello(email.substring(0, email.lastIndexOf('@')))
    //console.log('user: ' + JSON.stringify(user))
    //console.log(JSON.stringify(resp.body))
    return {
      props: {
        authenticated: true,
        username: email,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        authenticated: false,
      },
    }
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
