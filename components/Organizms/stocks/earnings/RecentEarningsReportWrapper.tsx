import { Box } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import RecentEarningsReport from './RecentEarningsReport'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const RecentEarningsReportWrapper = () => {
  const mutateKey = 'recent-earnings'
  const dataFn = async () => {
    const resp = await serverGetFetch('/RecentEarnings')
    return resp.Body as StockEarning[]
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      {isLoading && <ComponentLoader />}
      <Box py={2}>
        {!isLoading && data && data.length === 0 && <NoDataFound />}
        {data && <RecentEarningsReport data={data} />}
      </Box>
    </>
  )
}

export default RecentEarningsReportWrapper
