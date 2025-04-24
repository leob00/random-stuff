import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import RecentEarningsReport from './RecentEarningsReport'

const RecentEarningsReportWrapper = () => {
  const mutateKey = 'recent-earnings'
  const dataFn = async () => {
    const resp = await serverGetFetch('/RecentEarnings')
    return resp.Body as StockEarning[]
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      {isLoading && <BackdropLoader />}
      <Box py={2}>
        {!isLoading && data && data.length === 0 && <NoDataFound />}
        {data && data.length > 0 && <RecentEarningsReport data={data} />}
      </Box>
    </>
  )
}

export default RecentEarningsReportWrapper
