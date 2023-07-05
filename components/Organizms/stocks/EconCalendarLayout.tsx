import { Box, Link, Paper, Stack, Typography } from '@mui/material'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import WarmupBox from 'components/Atoms/WarmupBox'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { EconCalendarItem, getEconCalendar } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

interface Model {
  date: string
  items: EconCalendarItem[]
}

const EconCalendarLayout = () => {
  const [data, setData] = React.useState<EconCalendarItem[]>([])
  const [calendar, setCalendar] = React.useState<Model[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = async () => {
    const result = await getEconCalendar()
    const datesMap = new Map<string, EconCalendarItem[]>()
    result.forEach((item) => {
      datesMap.set(
        dayjs(item.EventDate).format('MM/DD/YYYY'),
        result.filter((o) => {
          return dayjs(o.EventDate).format('MM/DD/YYYY') === dayjs(item.EventDate).format('MM/DD/YYYY')
        }),
      )
    })
    //console.log(datesMap)
    const calendar: Model[] = []
    const keys = Array.from(datesMap.keys())
    keys.forEach((key) => {
      calendar.push({
        date: key,
        items: datesMap.get(key) ?? [],
      })
    })
    setCalendar(calendar)

    setData(result)
  }

  React.useEffect(() => {
    const fn = async () => {
      await loadData()
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box py={2}>
      {isLoading ? (
        <>
          <WarmupBox />
          <LargeGridSkeleton />
        </>
      ) : (
        <Box pt={2}>
          {calendar.map((item) => (
            <Box key={item.date}>
              <ListHeader text={`${item.date}`} item={item} onClicked={() => {}} />
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
          {calendar.length === 0 && <NoDataFound />}
        </Box>
      )}
    </Box>
  )
}

export default EconCalendarLayout
