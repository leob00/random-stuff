import HomeMenu from 'components/Organizms/HomeMenu'
import Seo from 'components/Organizms/Seo'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import React from 'react'

const Home = () => {
  return (
    <>
      <Seo pageTitle='Home' />
      <HomeMenu />
    </>
  )
}

export default Home
