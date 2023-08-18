import { Box, Link, Paper, Stack, Typography, useTheme } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { CasinoBlue, CasinoBlueTransparent, DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse, StockEarning } from 'lib/backend/api/qln/qlnApi'
import { orderBy, uniq } from 'lodash'
import numeral from 'numeral'
import React from 'react'
import useSWR, { Fetcher } from 'swr'
import StockEarningsCalendarDetails from './StockEarningsCalendarDetails'
import StockEarningsTable from './StockEarningsTable'

const config = apiConnection().qln
const apiUrl = `${config.url}/RecentEarnings`
const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)

const EarningsCalendarLayout = () => {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [scrollIntoView, setScrollIntoView] = React.useState(false)
  const [filteredResults, setFilteredResults] = React.useState<StockEarning[]>([])
  const { data, isLoading, isValidating } = useSWR(apiUrl, fetcher)
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)
  const theme = useTheme()

  const filterResult = (dt: string) => {
    //const res = [...items]
    return orderBy(
      (data!.Body as StockEarning[]).filter((m) => m.ReportDate === dt),
      ['StockQuote.Company'],
      ['asc'],
    )
  }
  const handleDateClicked = (dt: string) => {
    setScrollIntoView(true)
    setSelectedDate(dt)
    setFilteredResults(filterResult(dt))
  }

  React.useEffect(() => {
    if (scrollIntoView) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setScrollIntoView(false)
  }, [scrollIntoView])

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
              <Box py={1}>
                <Paper
                  component={Stack}
                  sx={{
                    minHeight: { xs: 180, sm: 160 },
                    p: 2,
                    width: { xs: 150, sm: 240 },
                    direction: 'column',
                    justifyContent: 'center',
                    backgroundColor: key === selectedDate ? (theme.palette.mode === 'dark' ? CasinoBlueTransparent : 'whitesmoke') : 'unset',
                  }}
                >
                  <Box textAlign={'center'}>
                    <Typography>{`${dayjs(key).format('MM/DD/YYYY')}`}</Typography>
                    <LinkButton2 onClick={() => handleDateClicked(key)}>{`${numeral(values.length).format('###,###')} earnings`}</LinkButton2>
                  </Box>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>
        {selectedDate && data && (
          <Box pt={1}>
            <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -12 }}></Typography>
            <StockEarningsCalendarDetails data={filteredResults} />
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
