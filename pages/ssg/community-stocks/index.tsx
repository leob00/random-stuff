import type { GetStaticProps, NextPage } from 'next'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenteredParagraph from 'components/Atoms/Text/CenteredParagraph'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CategoryType, getRandomStuff, LambdaBody } from 'lib/backend/api/aws/apiGateway'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import { orderBy } from 'lodash'
import CommunityStocksLayout from 'components/Organizms/stocks/CommunityStocksLayout'

interface PageProps {
  result: StockQuote[]
}
const communityKey: CategoryType = 'community-stocks'

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const cData = (await getRandomStuff(communityKey)) as StockQuote[]
  const communityResult = orderBy(cData, ['Company'], 'asc')
  console.log(`retrieved ${communityResult.length} community quotes`)

  return {
    props: {
      result: communityResult,
    },
  }
}
const Page: NextPage<PageProps> = ({ result }) => {
  return (
    <ResponsiveContainer>
      <CenteredHeader title='Community Stocks' />
      <CenteredParagraph text={'stocks tracked by all users'} />
      <CommunityStocksLayout data={result} />
    </ResponsiveContainer>
  )
}

export default Page
