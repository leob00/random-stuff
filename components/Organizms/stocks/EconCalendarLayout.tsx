import { Box, Link, Paper, Stack, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { EconCalendarItem, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import useSWR, { Fetcher } from 'swr'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

interface Model {
  date: string
  items: EconCalendarItem[]
}
const config = apiConnection().qln
const apiUrl = `${config.url}/EconCalendar`
const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)

const EconCalendarLayout = () => {
  const { data, isLoading, isValidating } = useSWR(apiUrl, fetcher, { refreshInterval: 60000 })

  const RenderDisplay = (apiResult: QlnApiResponse) => {
    const result = apiResult.Body as EconCalendarItem[]
    const datesMap = new Map<string, EconCalendarItem[]>()
    result.forEach((item) => {
      datesMap.set(
        `${dayjs(item.EventDate).format('dddd')}, ${dayjs(item.EventDate).format('MMM DD YYYY')}`,
        result.filter((o) => {
          return dayjs(o.EventDate).format('MM/DD/YYYY') === dayjs(item.EventDate).format('MM/DD/YYYY')
        }),
      )
    })
    const calendar: Model[] = []
    const keys = Array.from(datesMap.keys())
    keys.forEach((key) => {
      calendar.push({
        date: key,
        items: datesMap.get(key) ?? [],
      })
    })

    return (
      <Box pt={2}>
        {calendar.map((item) => (
          <Box key={item.date}>
            <ListHeader text={`${item.date === dayjs().format('MM/DD/YYYY') ? `Today: ${item.date}` : item.date}`} item={item} onClicked={() => {}} />
            <Box display={'flex'} gap={1} alignItems={'center'} flexWrap={'wrap'} justifyContent='center'>
              {item.items.map((event) => (
                <Box key={`${event.Name}-${event.EventDate}`} py={1}>
                  <Paper
                    component={Stack}
                    sx={{ minHeight: { xs: 180, sm: 160 }, p: 2, width: { xs: 150, sm: 240 }, direction: 'column', justifyContent: 'center' }}
                  >
                    {event.Url ? (
                      <Link href={event.Url} target={'_blank'}>
                        <Typography textAlign={'center'}>{event.Name}</Typography>
                      </Link>
                    ) : (
                      <Typography textAlign={'center'}>{event.Name}</Typography>
                    )}
                    <Box textAlign={'center'}>
                      <Typography variant={'caption'}>{`${dayjs(event.EventDate).format('hh:mm a')}`}</Typography>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
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

export default EconCalendarLayout
