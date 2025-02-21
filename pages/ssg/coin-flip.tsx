import { getItem } from 'app/serverActions/aws/dynamo/dynamo'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import CoinFlipLayout from 'components/Organizms/games/CoinFlipLayout'
import { CoinFlipStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { GetStaticProps, NextPage } from 'next'

export const getStaticProps: GetStaticProps = async (context) => {
  const resp = await getItem('coinflip-community')
  const result: CoinFlipStats =
    resp.data.length > 0
      ? (JSON.parse(resp.data) as CoinFlipStats)
      : {
          heads: 0,
          tails: 0,
        }

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
