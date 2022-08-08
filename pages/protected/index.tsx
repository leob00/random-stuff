import { Container, Typography } from '@mui/material'
import { withSSRContext } from 'aws-amplify'
import { hello, LambdaResponse } from 'lib/backend/api/apiGateway'
import { GetServerSideProps, NextPage } from 'next'

const Protected: NextPage<{ authenticated: boolean; username: string | undefined }> = ({ authenticated, username }) => {
  return (
    <>
      <Container>
        {!authenticated ? <Typography variant='h6'>not logged in</Typography> : <Typography variant='body1'>{`Welcome back, ${username?.substring(0, username.indexOf('@'))}!`}</Typography>}
        <Typography variant='body2'></Typography>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Auth } = withSSRContext(context)
  try {
    const user = await Auth.currentAuthenticatedUser()
    let email = user.attributes.email as string
    const resp = await hello(email.substring(0, email.lastIndexOf('@')))
    //console.log('user: ' + JSON.stringify(user))
    console.log(JSON.stringify(resp.body))
    return {
      props: {
        authenticated: true,
        username: user.attributes.email,
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

export default Protected
