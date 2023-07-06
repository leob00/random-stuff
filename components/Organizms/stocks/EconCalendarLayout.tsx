import { Box, Link, Paper, Stack, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { get } from 'lib/backend/api/fetchFunctions'
import { EconCalendarItem, qlnApiBaseUrl } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import useSWR, { Fetcher } from 'swr'

interface Model {
  date: string
  items: EconCalendarItem[]
}
const apiUrl = `${qlnApiBaseUrl}/EconCalendar`
const fetcher: Fetcher<any> = (url: string) => get(url)

const EconCalendarLayout = () => {
  const { data, error, isLoading, isValidating } = useSWR(apiUrl, fetcher)

  const RenderDisplay = (apiResult: any) => {
    const result = apiResult.Body as EconCalendarItem[]
    const datesMap = new Map<string, EconCalendarItem[]>()
    result.forEach((item) => {
      datesMap.set(
        dayjs(item.EventDate).format('MM/DD/YYYY'),
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
    console.log(calendar)

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

      {!isLoading && data && data.length === 0 && <NoDataFound />}
      {data && RenderDisplay(data)}
    </Box>
  )
}

export default EconCalendarLayout
