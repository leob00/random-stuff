import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockTable from './StockTable'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { useSwrHelper } from 'hooks/useSwrHelper'

const CommoditiesLayout = () => {
  const endPoint = `/Futures`
  const dataFn = async () => {
    const resp = await serverGetFetch(endPoint)
    return resp
  }

  const { data, isLoading } = useSwrHelper(endPoint, dataFn, { refreshInterval: 60000, revalidateOnFocus: false })

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {data && (
        <Box pt={2}>
          <ScrollIntoView enabled={true} margin={-17} />
          <StockTable stockList={data.Body as StockQuote[]} isStock={false} />
        </Box>
      )}
    </Box>
  )
}

export default CommoditiesLayout
