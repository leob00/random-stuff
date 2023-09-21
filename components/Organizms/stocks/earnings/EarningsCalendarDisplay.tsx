import { Box, Stack, Typography } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
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
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1)
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
    //console.log(dt)
    setSelectedDate(dt)
    setCurrentPageIndex(1)

    setFilteredResults(filterResult(data, dt))
  }
  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
  }
  const handleSearched = () => {
    if (currentPageIndex > 1) {
      setCurrentPageIndex(1)
    }
  }

  return (
    <>
      <ScrollIntoView enabled={true} margin={-16} />

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
            <StockEarningsCalendarDetails data={filteredResults} currentPageIndex={currentPageIndex} onPaged={handlePaged} onSearched={handleSearched} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default EarningsCalendarDisplay
