import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { NewsItem, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import NewsList from '../news/NewsList'
import { useSwrHelper } from 'hooks/useSwrHelper'

const StockNews = ({ quote }: { quote: StockQuote }) => {
  const mutateKey = `stock-news-${quote.Symbol}`

  const dataFn = async () => {
    const endpoint = `/NewsBySymbol?symbol=${quote.Symbol}`
    const resp = await serverGetFetch(endpoint)
    const result = resp.Body as NewsItem[]
    result.forEach((item) => {
      item.Rank = 0
      const companyNameWords = quote.Company.split(' ')
      if (companyNameWords.length > 1) {
        if (companyNameWords[1].length < 5) {
          if (companyNameWords[0].length > 5) {
            if (item.Headline && item.Headline.toLowerCase().includes(companyNameWords[0].substring(0, 5).toLowerCase())) {
              item.Rank = 100
            }
          }
        } else {
          if (item.Headline && item.Headline.toLowerCase().includes(`${companyNameWords[0]} ${companyNameWords[1]}`.toLowerCase())) {
            item.Rank = 100
          }
        }
      } else {
        if (item.Headline && item.Headline.toLowerCase().includes(`${companyNameWords[0]}`.toLowerCase())) {
          item.Rank = 100
        }
      }
    })
    const sorted = orderBy(result, ['Rank', 'PublishDate'], ['desc', 'desc'])
    return sorted
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box pb={2} pt={2} minHeight={400}>
      {isLoading && <BackdropLoader />}
      {data && <NewsList newsItems={data} hideSaveButton={true} showPublishDate={true} />}
    </Box>
  )
}

export default StockNews
