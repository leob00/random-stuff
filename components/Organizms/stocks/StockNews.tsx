import { Box } from '@mui/material'
import WarmupBox from 'components/Atoms/WarmupBox'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getNewsBySymbol, NewsItem } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import NewsList from '../news/NewsList'

const StockNews = ({ quote }: { quote: StockQuote }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([])
  React.useEffect(() => {
    const fn = async () => {
      const result = await getNewsBySymbol(quote.Symbol)
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
      setNewsItems(sorted)
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Box pb={2} pt={2}>
      {isLoading ? (
        <WarmupBox />
      ) : (
        <>
          <NewsList newsItems={newsItems} hideSaveButton={true} showPublishDate={true} />
        </>
      )}
    </Box>
  )
}

export default StockNews
