import type { GetStaticProps, NextPage } from 'next'
import HomeMenu from 'components/Organizms/HomeMenu'
import Seo from 'components/Organizms/Seo'

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  }
}
const Home: NextPage = () => {
  return (
    <>
      <Seo pageTitle='Home' />
      <HomeMenu />
    </>
  )
}

export default Home
