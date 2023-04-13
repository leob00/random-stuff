import { Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import WarmupBox from 'components/Atoms/WarmupBox'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getNewsBySymbol, NewsItem } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import NewsList from '../news/NewsList'

const StockNews = ({ quote }: { quote: StockQuote }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([])
  React.useEffect(() => {
    const fn = async () => {
      const result = await getNewsBySymbol(quote.Symbol)
      setNewsItems(result)
      setIsLoading(false)
    }
    fn()
  }, [])
  return (
    <Box pb={2} pt={2}>
      {isLoading ? (
        <WarmupBox />
      ) : (
        <>
          <NewsList newsItems={newsItems} hideSaveButton={true} />
        </>
      )}
    </Box>
  )
}

export default StockNews
