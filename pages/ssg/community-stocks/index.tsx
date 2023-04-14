import type { GetStaticProps, NextPage } from 'next'
import HomeMenu from 'components/Organizms/HomeMenu'
import Seo from 'components/Organizms/Seo'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenteredParagraph from 'components/Atoms/Text/CenteredParagraph'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CategoryType, getRandomStuff, LambdaBody, putRandomStuff, searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { isEqual, result } from 'lodash'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import { Box } from '@mui/material'
import StockTable from 'components/Organizms/stocks/StockTable'
import { orderBy } from 'lodash'
import { areObjectsEqual } from 'lib/util/objects'
import { refreshQuotes } from 'lib/backend/api/qln/qlnApi'

interface PageProps {
  result: StockQuote[]
}
const communityKey: CategoryType = 'community-stocks'
const searchKey: CategoryType = 'user-stock_list'

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const mapStockQuotes = (data: LambdaBody[]) => {
    const results: StockQuote[] = []
    data.forEach((item) => {
      const temp = JSON.parse(item.data) as StockQuote[]
      results.push(...temp)
    })
    const map = getMapFromArray(results, 'Symbol')
    const list = getListFromMap(map)
    const result = orderBy(list, ['Symbol'], ['asc'])
    return result
  }
  const userData = await searchRandomStuffBySecIndex(searchKey)
  const updatedQuotes = await refreshQuotes(mapStockQuotes(userData))

  const cData = (await getRandomStuff(communityKey)) as StockQuote[]
  const communityResult = orderBy(cData, ['Symbol'], 'asc')
  console.log(`retrieved ${updatedQuotes.length} user quotes`)
  console.log(`retrieved ${communityResult.length} community quotes`)
  //console.log('user result: ', JSON.stringify(userResult))
  //console.log('-------------------------------')
  //console.log('community result: ', JSON.stringify(communityResult))
  if (!areObjectsEqual(updatedQuotes, communityResult)) {
    console.log('community stocks are stale')
    await putRandomStuff('community-stocks', 'stocks', updatedQuotes)
    console.log(`updated ${updatedQuotes.length} community stocks`)
  } else {
    console.log('community stocks are up to date')
  }

  return {
    props: {
      result: updatedQuotes,
    },
  }
}
const Page: NextPage<PageProps> = ({ result }) => {
  return (
    <ResponsiveContainer>
      <CenteredHeader title='Community Stocks' />
      <CenteredParagraph text={'stocks tracked by all users'} />
      <Box py={1}>
        <StockTable stockList={result} />
      </Box>
    </ResponsiveContainer>
  )
}

export default Page
