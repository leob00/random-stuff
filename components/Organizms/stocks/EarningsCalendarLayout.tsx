import { Box, Link, Paper, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse, StockEarning } from 'lib/backend/api/qln/qlnApi'
import { orderBy, uniq } from 'lodash'
import numeral from 'numeral'
import React from 'react'
import useSWR, { Fetcher } from 'swr'
import StockEarningsTable from './StockEarningsTable'

const config = apiConnection().qln
const apiUrl = `${config.url}/RecentEarnings`
const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)

const EarningsCalendarLayout = () => {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)

  const { data, isLoading, isValidating } = useSWR(apiUrl, fetcher)

  const RenderDisplay = (apiResult: QlnApiResponse) => {
    const result = apiResult.Body as StockEarning[]
    const uniqueDates = orderBy(uniq(result.map((m) => m.ReportDate)))
    const datesMap = new Map<string, StockEarning[]>()
    uniqueDates.forEach((item) => {
      datesMap.set(
        item!,
        result.filter((m) => m.ReportDate === item),
      )
    })

    return (
      <Box pt={2}>
        <Box display={'flex'} gap={1} alignItems={'center'} flexWrap={'wrap'} justifyContent='center'>
          {Array.from(datesMap.entries()).map(([key, values]) => (
            <Box key={key}>
              {/* <ListHeader text={`${dayjs(key).format('MM/DD/YYYY')}`} item={key} onClicked={() => {}} /> */}
              <Box py={1}>
                <Paper
                  component={Stack}
                  sx={{ minHeight: { xs: 180, sm: 160 }, p: 2, width: { xs: 150, sm: 240 }, direction: 'column', justifyContent: 'center' }}
                >
                  <Box textAlign={'center'}>
                    <Typography>{`${dayjs(key).format('MM/DD/YYYY')}`}</Typography>
                    <LinkButton2 onClick={() => setSelectedDate(key)}>{`${numeral(values.length).format('###,###')} earnings`}</LinkButton2>
                  </Box>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>
        {selectedDate && data && (
          <Box pt={1}>
            <StockEarningsTable
              data={orderBy(
                (data.Body as StockEarning[]).filter((m) => m.ReportDate === selectedDate),
                ['StockQuote.Company'],
                ['asc'],
              )}
              showCompany
            />
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box py={2}>
      {isValidating && <BackdropLoader />}
      {isLoading && <LargeGridSkeleton />}

      {!isLoading && data && data.Body.length === 0 && <NoDataFound />}
      {data && RenderDisplay(data)}
    </Box>
  )
}

export default EarningsCalendarLayout
