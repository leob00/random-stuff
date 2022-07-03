import type { GetStaticProps, NextPage } from 'next'
import HomeMenu from 'components/Organizms/HomeMenu'

export const getStaticProps: GetStaticProps = async (context) => {
  //var data = await getYieldCurveData()
  return {
    props: {},
  }
}
const Home: NextPage = () => {
  return (
    <>
      <HomeMenu />
    </>
  )
}

export default Home
