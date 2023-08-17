import { Box } from '@mui/material'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockTable from './StockTable'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import useSWR, { Fetcher } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import { apiConnection } from 'lib/backend/api/config'

const FuturesLayout = () => {
  const config = apiConnection().qln
  const apiUrl = `${config.url}/Futures`
  const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)
  const { data, isLoading, isValidating } = useSWR(apiUrl, fetcher, { refreshInterval: 60000 })

  const RenderDisplay = (response: QlnApiResponse) => {
    const result = response.Body as StockQuote[]
    return <Box pt={2}>{!isLoading && <StockTable stockList={result} isStock={false} scrollIntoView scrollMargin={-14} />}</Box>
  }

  return (
    <Box py={2}>
      <>
        {isLoading && (
          <>
            <LargeGridSkeleton />
            <BackdropLoader />
          </>
        )}
      </>
      <>
        {isValidating && (
          <>
            <BackdropLoader />
          </>
        )}
        {data && <>{RenderDisplay(data)}</>}
      </>
    </Box>
  )
}

export default FuturesLayout
