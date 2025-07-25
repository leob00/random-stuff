import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockSentimentDisplay from 'components/Organizms/stocks/sentiment/StockSentimentDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { DynamoKeys } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import { getDynamoItemData } from 'lib/backend/csr/nextApiWrapper'

const Page = () => {
  const monthlyKey: DynamoKeys = 'stocks-monthly-market-sentiment'
  const dataFn = async () => {
    const record = await getDynamoItemData<StockStats[]>(monthlyKey)
    return record
  }
  const { data, isLoading } = useSwrHelper(monthlyKey, dataFn)
  return (
    <>
      <Seo pageTitle='Stock Sentiment' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Stock Market Sentiment' />
        <ScrollableBox maxHeight={800}>
          <Box pb={8}>{data && <StockSentimentDisplay data={data} />}</Box>
        </ScrollableBox>
      </ResponsiveContainer>
    </>
  )
}

export default Page
