import { Container, Typography } from '@mui/material'
import { withSSRContext } from 'aws-amplify'
import { GetServerSideProps, NextPage } from 'next'

const Protected: NextPage<{ authenticated: boolean; username: string | undefined }> = ({ authenticated, username }) => {
  return (
    <>
      <Container>{!authenticated ? <Typography variant='h6'>not logged in</Typography> : <Typography variant='body1'>Welcome, {username}</Typography>}</Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Auth } = withSSRContext(context)
  try {
    const user = await Auth.currentAuthenticatedUser()
    //console.log('user: ' + user)
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
