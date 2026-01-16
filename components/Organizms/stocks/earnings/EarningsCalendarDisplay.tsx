'use client'
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
import { filterResult, getDefaultDateOption } from './earningsCalendar'

const EarningsCalendarDisplay = ({ data }: { data: StockEarning[] }) => {
  const uniqueDates = orderBy(uniq(data.map((m) => m.ReportDate!)))
  const dateToSelect = getDefaultDateOption(data)
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
    handlePaged(1)
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
      <Box sx={{ display: !!selectedQuote ? 'none' : 'unset' }}>
        <ScrollIntoView />
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Box width={{ xs: '90%', md: '60%' }}>
            <Box>
              <Box>
                {dateOptions.length > 0 && (
                  <DropdownList options={dateOptions} selectedOption={dateToSelect ?? ''} onOptionSelected={handleDateSelected} fullWidth />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box py={2}>
          {selectedDate && (
            <Box pt={1}>
              <StockEarningsCalendarDetails
                data={filteredResults}
                currentPageIndex={currentPageIndex}
                onPaged={handlePaged}
                onSearched={handleSearched}
                onItemClicked={handleSymbolClicked}
              />
            </Box>
          )}
        </Box>
      </Box>
      {selectedQuote && <FullStockDetail item={selectedQuote} onClose={() => setSelectedQuote(null)} />}
    </>
  )
}

export default EarningsCalendarDisplay
