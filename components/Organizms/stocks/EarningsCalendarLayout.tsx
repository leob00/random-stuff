import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import EarningsCalendarDisplay from './earnings/EarningsCalendarDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'

const EarningsCalendarLayout = () => {
  const mutateKey = 'RecentEarnings'
  const dataFn = async () => {
    const resp = await serverGetFetch('/RecentEarnings')
    return resp.Body as StockEarning[]
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {!isLoading && data && data.length === 0 && <NoDataFound />}
      {data && data.length > 0 && <EarningsCalendarDisplay data={data} />}
    </Box>
  )
}

export default EarningsCalendarLayout
