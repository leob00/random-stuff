import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { EconCalendarItem, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import useSWR, { Fetcher } from 'swr'
import weekday from 'dayjs/plugin/weekday'
import EconCalendarDisplay from './EconCalendarDisplay'
dayjs.extend(weekday)

interface Model {
  date: string
  items: EconCalendarItem[]
}
const config = apiConnection().qln
const apiUrl = `${config.url}/EconCalendar`
const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)

const EconCalendarLayout = () => {
  const { data, isLoading, isValidating } = useSWR(apiUrl, fetcher, { refreshInterval: 60000, revalidateOnFocus: false })
  const isWaiting = isLoading || isValidating
  return (
    <Box py={2}>
      {isWaiting && <BackdropLoader />}
      {!isWaiting && data && data.Body.length === 0 && <NoDataFound />}
      {data && <EconCalendarDisplay apiResult={data} />}
    </Box>
  )
}

export default EconCalendarLayout
