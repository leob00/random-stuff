import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import CoinFlipLayout from 'components/Organizms/games/CoinFlipLayout'
import { getRandomStuff } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { CoinFlipStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { GetStaticProps, NextPage } from 'next'

export const getStaticProps: GetStaticProps = async (context) => {
  const result = (await getRandomStuff('coinflip-community')) as CoinFlipStats

  return {
    props: {
      coinflipStats: result,
    },
  }
}

const Page: NextPage<{ coinflipStats: CoinFlipStats }> = ({ coinflipStats }) => {
  return (
    <>
      <Seo pageTitle='Coin Flip' />
      <ResponsiveContainer>
        <PageHeader text='Coin Flip' />
        <CoinFlipLayout coinflipStats={coinflipStats} />
      </ResponsiveContainer>
    </>
  )
}

export default Page
