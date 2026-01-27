'use client'
import { Box } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import EarningsCalendarDisplay from './earnings/EarningsCalendarDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const EarningsCalendarLayout = () => {
  const mutateKey = 'RecentEarnings'
  const dataFn = async () => {
    const resp = await serverGetFetch('/RecentEarnings')
    return resp.Body as StockEarning[]
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box py={2}>
      {isLoading && <ComponentLoader pt={8} />}
      {!isLoading && data && data.length === 0 && <NoDataFound />}
      {data && data.length > 0 && <EarningsCalendarDisplay data={data} />}
    </Box>
  )
}

export default EarningsCalendarLayout
