import { Box, Link, Paper, Stack, Typography } from '@mui/material'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { EconCalendarItem, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

interface Model {
  date: string
  items: EconCalendarItem[]
}
const EconCalendarDisplay = ({ apiResult }: { apiResult: QlnApiResponse }) => {
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
      <ScrollableBox>
        {calendar.map((item) => (
          <Box key={item.date}>
            <ListHeader text={`${item.date === dayjs().format('MM/DD/YYYY') ? `Today: ${item.date}` : item.date}`} item={item} onClicked={() => {}} />
            <Box display={'flex'} gap={1} alignItems={'center'} flexWrap={'wrap'} justifyContent='center'>
              {item.items.map((event) => (
                <Box key={`${event.Name}-${event.EventDate}`} py={1}>
                  <Paper component={Stack} sx={{ minHeight: { xs: 260, sm: 180 }, p: 2, width: { xs: 160, sm: 240 }, direction: 'column', justifyContent: 'center' }}>
                    {event.Url ? (
                      <Link href={event.Url} target={'_blank'}>
                        <Typography textAlign={'center'}>{event.Name}</Typography>
                      </Link>
                    ) : (
                      <HtmlView textAlign={'center'} html={event.Name} />
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
      </ScrollableBox>
    </Box>
  )
}

export default EconCalendarDisplay
