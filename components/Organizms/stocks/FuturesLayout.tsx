import { Box, ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import HamburgerMenu from 'components/Molecules/Menus/HamburgerMenu'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { qlnApiBaseUrl, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockTable from './StockTable'
import CachedIcon from '@mui/icons-material/Cached'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import useSWR, { Fetcher, mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'

const FuturesLayout = () => {
  const apiUrl = `${qlnApiBaseUrl}/Futures`
  const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)
  const { data, isLoading, isValidating } = useSWR(apiUrl, fetcher)

  const RenderDisplay = (response: QlnApiResponse) => {
    const result = response.Body as StockQuote[]
    return <Box pt={2}>{!isLoading && <StockTable stockList={result} isStock={false} />}</Box>
  }

  const handleRefresh = () => {
    mutate(apiUrl)
  }

  return (
    <Box py={2}>
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
