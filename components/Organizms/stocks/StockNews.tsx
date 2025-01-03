import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { NewsItem, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import NewsList from '../news/NewsList'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

const StockNews = ({ quote, profile }: { quote: StockQuote; profile: UserProfile | null }) => {
  const mutateKey = `stock-news-${quote.Symbol}`

  const dataFn = async () => {
    const endpoint = `/NewsBySymbol?symbol=${quote.Symbol}`
    const resp = await serverGetFetch(endpoint)
    const result = resp.Body as NewsItem[]
    const sorted = orderBy(result, ['PublishDate'], ['desc', 'desc'])
    return sorted
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box pb={2} pt={2} minHeight={400}>
      {isLoading && <BackdropLoader />}
      {data && <NewsList newsItems={data} userProfile={profile} hideSaveButton={profile === null} showPublishDate={true} />}
    </Box>
  )
}

export default StockNews
