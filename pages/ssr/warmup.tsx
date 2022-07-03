import React, { useEffect } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import router from 'next/router'
import { withSSRContext } from 'aws-amplify'
import WarmupBox from 'components/Atoms/WarmupBox'
import HomeMenu from 'components/Organizms/HomeMenu'

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

const WarmUp: NextPage<{ authenticated: boolean; username: string | undefined }> = ({ authenticated, username }) => {
  useEffect(() => {
    router.push('/')
  }, [])

  return (
    <>
      <HomeMenu />
      <WarmupBox />
    </>
  )
}

export default WarmUp
