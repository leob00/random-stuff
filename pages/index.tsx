import type { GetStaticProps, NextPage } from 'next'
import HomeMenu from 'components/Organizms/HomeMenu'
import Header from 'next/head'
import logo from '/public/images/logo-with-text-blue-small.png'

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  }
}
const Home: NextPage = () => {
  return (
    <>
      <Header>
        <title>Random Stuff - Home</title>
        <meta property='og:title' content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.' key='homeTitle' />
        <meta property='og:description' content='Find recipes, create notes, and view random pictures. Happy browsing!' key='homeDescription' />
        <meta property='og:image' content='https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small1200X630.png' key='homeLogo' />
      </Header>
      <HomeMenu />
    </>
  )
}

export default Home
