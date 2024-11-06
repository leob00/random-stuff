import { Box } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import dayjs from 'dayjs'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import { orderBy, uniq } from 'lodash'
import StockEarningsCalendarDetails from './StockEarningsCalendarDetails'
import { useState } from 'react'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuPortfolio from 'components/Molecules/Menus/ContextMenuPortfolio'
import RecentEarningsReport from './RecentEarningsReport'
const filterResult = (items: StockEarning[], dt: string | null) => {
  return orderBy(
    items.filter((m) => m.ReportDate === dt),
    ['StockQuote.Company'],
    ['asc'],
  )
}
const EarningsCalendarDisplay = ({ data }: { data: StockEarning[] }) => {
  const uniqueDates = orderBy(uniq(data.map((m) => m.ReportDate!)))
  const todayEarningsDate = uniqueDates.find((m) => dayjs(m).format('MM/DD/YYYY') === dayjs().format('MM/DD/YYYY'))
  const dateToSelect = getDefaultDateOption(uniqueDates, todayEarningsDate)
  const [selectedDate, setSelectedDate] = useState(dateToSelect)
  const [filteredResults, setFilteredResults] = useState(dateToSelect ? filterResult(data, dateToSelect) : [])
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
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
      <ScrollIntoView enabled={true} margin={-15} />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
        <Box width={{ xs: '90%', md: '60%' }}>
          <Box>
            <Box>
              {dateOptions.length > 0 && (
                <DropdownList options={dateOptions} selectedOption={dateToSelect ?? ''} onOptionSelected={handleDateSelected} fullWidth />
              )}
            </Box>
            <Box px={1} display={'flex'} gap={2} py={1} alignItems={'center'}>
              <SiteLink href='/csr/stock-earnings-search' text='advanced search' />|
              <SiteLink href='/csr/stocks/earnings-reports' text='reports' />
            </Box>
          </Box>
        </Box>
      </Box>
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

const getDefaultDateOption = (dates: string[], todayDate?: string) => {
  let result = null
  if (todayDate) {
    return todayDate
  }

  if (dates.length > 0) {
    const past = dates.filter((m) => dayjs(m).isBefore(dayjs()))
    if (past.length > 0) {
      return past[past.length - 1]
    }
    return dates[dates.length - 1]
  }
  //uniqueDates.length > 0 ? (todayDate ? todayDate : uniqueDates[0]) : null
  return result
}

export default EarningsCalendarDisplay
