import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockEarning, StockEarningAggregate, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import RecentEarningsReport from './RecentEarningsReport'
import QuarterlyEarningsReport from './QuarterlyEarningsReport'

const QuarterlyEarningsReportWrapper = () => {
  const mutateKey = 'quarterly-earnings'
  const dataFn = async () => {
    const resp = await serverGetFetch('/EarningsReport')
    return resp.Body as StockEarningAggregate[]
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      {isLoading && <BackdropLoader />}
      <Box py={2}>
        {!isLoading && data && data.length === 0 && <NoDataFound />}
        {data && data.length > 0 && <QuarterlyEarningsReport data={data} />}
      </Box>
    </>
  )
}

export default QuarterlyEarningsReportWrapper
