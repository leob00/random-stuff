import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse, StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import useSWR, { Fetcher } from 'swr'
import EarningsCalendarDisplay from './earnings/EarningsCalendarDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'

// const config = apiConnection().qln
// const apiUrl = `${config.url}/RecentEarnings`
// const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)

const EarningsCalendarLayout = () => {
  const mutateKey = 'RecentEarnings'
  const dataFn = async () => {
    const result = await serverGetFetch('/RecentEarnings')
    return result
  }

  //const { data, isLoading, isValidating } = useSWR(apiUrl, fetcher)
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {!isLoading && data && data.Body.length === 0 && <NoDataFound />}
      {data && data.Body.length > 0 && <EarningsCalendarDisplay data={data.Body as StockEarning[]} />}
    </Box>
  )
}

export default EarningsCalendarLayout
