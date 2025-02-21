import { getItem, putItem } from 'app/serverActions/aws/dynamo/dynamo'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RouletteLayout from 'components/Organizms/roulette/RouletteLayout'
import Seo from 'components/Organizms/Seo'
import { WheelSpinStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { GetStaticProps, NextPage } from 'next'

export const getStaticProps: GetStaticProps = async (context) => {
  const resp = await getItem('wheelspin-community')
  const emptyResult: WheelSpinStats = {
    black: 0,
    doubleZero: 0,
    even: 0,
    odd: 0,
    red: 0,
    total: 0,
    zero: 0,
  }
  if (resp.data.length === 0) {
    await putItem({
      key: 'wheelspin-community',
      category: 'random',
      data: emptyResult,
      count: 0,
      expiration: 0,
      last_modified: getUtcNow().format(),
    })
  }
  const result: WheelSpinStats =
    resp.data.length > 0
      ? (JSON.parse(resp.data) as WheelSpinStats)
      : {
          black: 0,
          doubleZero: 0,
          even: 0,
          odd: 0,
          red: 0,
          total: 0,
          zero: 0,
        }

  return {
    props: {
      spinStats: result,
    },
  }
}

const Roulette: NextPage<{ spinStats: WheelSpinStats }> = ({ spinStats }) => {
  return (
    <>
      <Seo pageTitle={'Roulette'} />
      <ResponsiveContainer>
        <PageHeader text='Roulette' />
        <RouletteLayout spinStats={spinStats} />
      </ResponsiveContainer>
    </>
  )
}

export default Roulette
