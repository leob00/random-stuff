'use client'
import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import StockTable from './StockTable'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const CommoditiesLayout = ({ data }: { data: StockQuote[] }) => {
  // const mutateKey = 'commodities'
  // const dataFn = async () => {
  //   const endPoint = `/Futures`

  //   const resp = await serverGetFetch(endPoint)
  //   const quotes = resp.Body as StockQuote[]
  //   return quotes
  // }

  // const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const { userProfile, isValidating } = useProfileValidator()
  return (
    <>
      {!isValidating && (
        <Box py={2}>
          {data && (
            <Box pt={2} width={'100%'}>
              <StockTable stockList={data} marketCategory='commodities' showSummary userProfile={userProfile} />
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default CommoditiesLayout
