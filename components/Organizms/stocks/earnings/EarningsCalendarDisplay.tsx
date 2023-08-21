import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import dayjs from 'dayjs'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import { orderBy, uniq } from 'lodash'
import React from 'react'
import StockEarningsCalendarDetails from '../StockEarningsCalendarDetails'
const filterResult = (items: StockEarning[], dt: string | null) => {
  return orderBy(
    items.filter((m) => m.ReportDate === dt),
    ['StockQuote.Company'],
    ['asc'],
  )
}
const EarningsCalendarDisplay = ({ data }: { data: StockEarning[] }) => {
  const uniqueDates = orderBy(uniq(data.map((m) => m.ReportDate!)))
  const todayDate = uniqueDates.find((m) => dayjs(m).format('MM/DD/YYYY') === dayjs().format('MM/DD/YYYY'))
  const dateToSelect = uniqueDates.length > 0 ? (todayDate ? todayDate : uniqueDates[0]) : null
  const [selectedDate, setSelectedDate] = React.useState(dateToSelect)
  const [filteredResults, setFilteredResults] = React.useState(dateToSelect ? filterResult(data, dateToSelect) : [])
  const [scrollIntoView, setScrollIntoView] = React.useState(dateToSelect ? true : false)
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)
  const datesMap = new Map<string, StockEarning[]>()

  uniqueDates.forEach((item) => {
    datesMap.set(
      item!,
      data.filter((m) => m.ReportDate === item),
    )
  })

  const dateOptions: DropdownItem[] = uniqueDates.map((item) => {
    return {
      text: `${dayjs(item).format('MM/DD/YYYY') === dayjs().format('MM/DD/YYYY') ? 'Today' : dayjs(item).format('MM/DD/YYYY')}`,
      value: `${item}`,
    }
  })

  const handleDateSelected = (dt: string) => {
    setScrollIntoView(true)
    //console.log(dt)
    setSelectedDate(dt)
    setFilteredResults(filterResult(data, dt))
  }
  React.useEffect(() => {
    if (scrollIntoView) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setScrollIntoView(false)
  }, [scrollIntoView])
  return (
    <>
      <CenterStack>
        {dateOptions.length > 0 && (
          <Stack width={{ xs: '90%', md: '60%' }}>
            <DropdownList options={dateOptions} selectedOption={dateToSelect ?? ''} onOptionSelected={handleDateSelected} fullWidth />
          </Stack>
        )}
      </CenterStack>
      <Box py={2}>
        {selectedDate && (
          <Box pt={1}>
            <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -22 }}></Typography>

            <StockEarningsCalendarDetails data={filteredResults} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default EarningsCalendarDisplay
