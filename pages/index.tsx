import type { GetStaticProps, NextPage } from 'next'
import HomeMenu from 'components/Organizms/HomeMenu'
import Seo from 'components/Organizms/Seo'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const Home = () => {
  return (
    <>
      <BackdropLoader />
      <Seo pageTitle='Home' />
      <HomeMenu />
    </>
  )
}

export default Home
