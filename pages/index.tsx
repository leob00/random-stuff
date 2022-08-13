import type { GetStaticProps, NextPage } from 'next'
import HomeMenu from 'components/Organizms/HomeMenu'
import Header from 'next/head'

export const getStaticProps: GetStaticProps = async (context) => {
  //var data = await getYieldCurveData()
  return {
    props: {},
  }
}
const Home: NextPage = () => {
  return (
    <>
      <Header>
        <title>Random Stuff - Home</title>
        <meta property='og:title' content='Random Stuff - Home' key='homeTitle' />
        <meta property='og:description' content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.' key='homeDescription' />
        <meta property='og:image' content='/images/logo-with-text-blue.png' key='homeLogo' />
      </Header>
      <HomeMenu />
    </>
  )
}

export default Home
