import React, { useEffect } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import router from 'next/router'
import WarmupBox from 'components/Atoms/WarmupBox'
import HomeMenu from 'components/Organizms/HomeMenu'
import { getUserSSR } from 'lib/backend/server-side/serverSideAuth'

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const user = await getUserSSR(context)
    return {
      props: {
        authenticated: true,
        username: user?.email,
      },
    }
  } catch (error) {
    console.error(error)
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
