import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getFutures } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'
import StockTable from './StockTable'

const FuturesLayout = () => {
  const [data, setData] = React.useState<StockQuote[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = async () => {
    const result = await getFutures()
    setData(result)
  }

  React.useEffect(() => {
    const fn = async () => {
      await loadData()
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box py={2}>
      {isLoading ? (
        <>
          <WarmupBox />
          <LargeGridSkeleton />
        </>
      ) : (
        <Box pt={2}>
          <StockTable stockList={data} isStock={false} />
        </Box>
      )}
    </Box>
  )
}

export default FuturesLayout
