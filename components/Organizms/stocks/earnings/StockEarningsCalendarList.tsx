import { Box, Typography } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { filterResult, getDefaultDateOption } from './earningsCalendar'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import StockEarningsCompanyDisplay from './StockEarningsCompanyDisplay'
import StockChange from '../StockChange'
import { useClientPager } from 'hooks/useClientPager'
import Pager from 'components/Atoms/Pager'
import { orderBy, uniq } from 'lodash'
import { useEffect, useReducer } from 'react'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import Clickable from 'components/Atoms/Containers/Clickable'
import { useRouter } from 'next/navigation'
import HoverEffect from 'components/Molecules/Lists/HoverEffect'
import dayjs from 'dayjs'
import ArrowLeftButton from 'components/Atoms/Buttons/ArrowLeftButton'
import ArrowRightButton from 'components/Atoms/Buttons/ArrowRightButton'

type Model = {
  isLoading?: boolean
  allDates: string[]
  selectedDate: string | null
  backButtonDisabled: boolean
  nextButtonDisabled: boolean
  earnings: StockEarning[]
}

const StockEarningsCalendarList = ({ data }: { data: StockEarning[] }) => {
  const uniqueDates = orderBy(uniq(data.map((m) => m.ReportDate!)))
  const dateToSelect = getDefaultDateOption(data)
  const filtered = orderBy(filterResult(data, dateToSelect), ['StockQuote.MarketCap'], ['desc'])
  const pageSize = 3
  const { getPagedItems, setPage, pagerModel, reset } = useClientPager(filtered, pageSize)
  const pagedItems = getPagedItems(filtered)
  const scroller = useScrollTop(0)
  const router = useRouter()

  const defaultModel: Model = {
    allDates: uniqueDates,
    selectedDate: dateToSelect,
    backButtonDisabled: dayjs(dateToSelect).isSame(dayjs(uniqueDates[0])),
    nextButtonDisabled: dayjs(dateToSelect).isSame(dayjs(uniqueDates[uniqueDates.length - 1])),
    earnings: pagedItems,
    isLoading: true,
  }

  const [model, setModel] = useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)

    const newPagedItems = getPagedItems(filtered)
    setModel({ ...model, earnings: newPagedItems })
    scroller.scroll()
  }

  const handleClicked = async (item: string) => {
    router.push(`/csr/stocks/details/${item}`)
  }
  const handleBackClick = () => {
    if (model.selectedDate) {
      const idx = model.allDates.findIndex((m) => m === model.selectedDate)
      if (idx > 0) {
        const newIdx = idx - 1
        const newDt = model.allDates[newIdx]
        const newData = orderBy(filterResult(data, newDt), ['StockQuote.MarketCap'], ['desc'])
        const newPagedItems = getPagedItems(newData)
        setModel({
          ...model,
          selectedDate: newDt,
          backButtonDisabled: newIdx === 0,
          nextButtonDisabled: newIdx >= model.allDates.length - 1,
          earnings: newPagedItems,
        })
        handlePaged(1)
      }
    }
  }
  const handleNextClick = () => {
    if (model.selectedDate) {
      const idx = model.allDates.findIndex((m) => m === model.selectedDate)
      if (idx < model.allDates.length) {
        const newIdx = idx + 1
        const newDt = model.allDates[newIdx]
        const newData = orderBy(filterResult(data, newDt), ['StockQuote.MarketCap'], ['desc'])
        const newPagedItems = getPagedItems(newData)
        setModel({
          ...model,
          selectedDate: newDt,
          nextButtonDisabled: newIdx >= model.allDates.length - 1,
          backButtonDisabled: newIdx === 0,
          earnings: newPagedItems,
        })
        handlePaged(1)
      }
    }
  }

  // useEffect(() => {
  //   setModel({ ...model, isLoading: false })
  //   //reset(model.earnings)
  // }, [])

  return (
    <>
      <>
        <Box>
          {!!model.selectedDate && (
            <Box pb={4} my={-1} display={'flex'} justifyContent={'center'} gap={1} alignItems={'center'}>
              <ArrowLeftButton disabled={model.backButtonDisabled} onClicked={handleBackClick} />
              <Typography variant='caption'>{dayjs(model.selectedDate).format('MM/DD/YYYY')}</Typography>
              <ArrowRightButton disabled={model.nextButtonDisabled} onClicked={handleNextClick} />
            </Box>
          )}
          {model.earnings.map((item) => (
            <Box key={item.Symbol} pb={4} px={1}>
              <HoverEffect>
                <Clickable
                  onClicked={() => {
                    handleClicked(item.Symbol)
                  }}
                >
                  <StockEarningsCompanyDisplay item={item} />
                  {item.StockQuote && <StockChange item={item.StockQuote} />}
                </Clickable>
              </HoverEffect>
            </Box>
          ))}
          <Pager
            pageCount={pagerModel.totalNumberOfPages}
            itemCount={pagedItems.length}
            itemsPerPage={pageSize}
            onPaged={(pageNum: number) => handlePaged(pageNum)}
            defaultPageIndex={pagerModel.page}
            totalItemCount={pagerModel.totalNumberOfItems}
          ></Pager>
        </Box>
      </>
    </>
  )
}

export default StockEarningsCalendarList
