import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import StockTable from './StockTable'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const CommoditiesLayout = () => {
  const endPoint = `/Futures`
  const dataFn = async () => {
    const resp = await serverGetFetch(endPoint)
    const quotes = resp.Body as StockQuote[]
    return quotes
  }

  const { data, isLoading } = useSwrHelper(endPoint, dataFn, { revalidateOnFocus: false })

  const { userProfile, isValidating } = useProfileValidator()
  return (
    <>
      {!isValidating && (
        <Box py={2}>
          {isLoading && <ComponentLoader />}
          {data && (
            <Box pt={2}>
              <ScrollIntoView enabled />

              <StockTable stockList={data} marketCategory='commodities' showSummary userProfile={userProfile} />
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default CommoditiesLayout
