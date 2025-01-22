import { Box } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import dayjs from 'dayjs'
import { StockEarning, getStockQuote } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import { orderBy, uniq } from 'lodash'
import StockEarningsCalendarDetails from './StockEarningsCalendarDetails'
import { useState } from 'react'
import { StockQuote } from 'lib/backend/api/models/zModels'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import FullStockDetail from '../FullStockDetail'
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
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null)
  const datesMap = new Map<string, StockEarning[]>()
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSymbolClicked = async (symbol: string) => {
    setIsLoading(true)
    const quote = await getStockQuote(symbol)
    setSelectedQuote(quote)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      {selectedQuote && <FullStockDetail item={selectedQuote} onClose={() => setSelectedQuote(null)} />}
      {!selectedQuote && (
        <>
          <ScrollIntoView />
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
            <Box width={{ xs: '90%', md: '60%' }}>
              <Box>
                <Box>{dateOptions.length > 0 && <DropdownList options={dateOptions} selectedOption={dateToSelect ?? ''} onOptionSelected={handleDateSelected} fullWidth />}</Box>
              </Box>
            </Box>
          </Box>
          <Box py={2}>
            {selectedDate && (
              <Box pt={1}>
                <StockEarningsCalendarDetails data={filteredResults} currentPageIndex={currentPageIndex} onPaged={handlePaged} onSearched={handleSearched} onItemClicked={handleSymbolClicked} />
              </Box>
            )}
          </Box>
        </>
      )}
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
