import type { GetStaticProps, NextPage } from 'next'
import HomeMenu from 'components/Organizms/HomeMenu'
import Seo from 'components/Organizms/Seo'

const Home = () => {
  return (
    <>
      <Seo pageTitle='Home' />
      <HomeMenu />
    </>
  )
}

export default Home
