import { Box, Typography } from '@mui/material'
import WarmupBox from 'components/Atoms/WarmupBox'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getNewsBySymbol, NewsItem } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import NewsList from '../news/NewsList'

const StockEarnings = ({ quote }: { quote: StockQuote }) => {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
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
          <Typography>coming soon</Typography>
        </>
      )}
    </Box>
  )
}

export default StockEarnings
