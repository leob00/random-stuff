import { Box, Typography, useTheme } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { useClientPager } from 'hooks/useClientPager'
import Pager from 'components/Atoms/Pager'
import { orderBy, uniq } from 'lodash'
import { useReducer } from 'react'
import Clickable from 'components/Atoms/Containers/Clickable'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import ArrowLeftButton from 'components/Atoms/Buttons/ArrowLeftButton'
import ArrowRightButton from 'components/Atoms/Buttons/ArrowRightButton'
import { filterResult, getDefaultDateOption } from 'components/Organizms/stocks/earnings/earningsCalendar'
import StockEarningsCompanyDisplay from 'components/Organizms/stocks/earnings/StockEarningsCompanyDisplay'
import StockChange from 'components/Organizms/stocks/StockChange'
import { getPagedArray } from 'lib/util/collections'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { getPositiveNegativeColor } from 'components/Organizms/stocks/StockListItem'
import { PageState, encryptPageState } from 'hooks/ui/page-state/pageStateUtil'

type Model = {
  isLoading?: boolean
  allDates: string[]
  selectedDate: string | null
  backButtonDisabled: boolean
  nextButtonDisabled: boolean
  earnings: StockEarning[]
}

const StockEarningsCalendarList = ({ data, maxHeight }: { data: StockEarning[]; maxHeight?: number }) => {
  const uniqueDates = orderBy(uniq(data.map((m) => m.ReportDate!)))
  const dateToSelect = getDefaultDateOption(data)
  const filtered = filterResult(data, dateToSelect)
  const pageSize = 10
  const { getPagedItems, setPage, pagerModel, reset } = useClientPager(filtered, pageSize)
  const pagedItems = getPagedItems(filtered)
  const scroller = useScrollTop(0)
  const router = useRouter()
  const theme = useTheme()

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
    const newPagedItems = getPagedArray(filtered, pageSize)
    setModel({ ...model, earnings: newPagedItems[pageNum - 1].items })
    scroller.scroll()
  }

  const handleClicked = async (item: string) => {
    const pageState: PageState = {
      route: '/protected/csr/dashboard',
      args: [
        {
          key: 'dt',
          value: model.selectedDate ?? '',
        },
      ],
    }
    const state = encryptPageState(pageState)
    router.push(`/csr/stocks/details/${item}?state=${state}`)
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
        setPage(1)
        scroller.scroll()
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
        const newPagedItems = getPagedArray(newData, pageSize)
        setModel({
          ...model,
          selectedDate: newDt,
          nextButtonDisabled: newIdx >= model.allDates.length - 1,
          backButtonDisabled: newIdx === 0,
          earnings: newPagedItems[0].items,
        })
        setPage(1)
        scroller.scroll()
      }
    }
  }

  return (
    <>
      <>
        <Box>
          {!!model.selectedDate && (
            <Box pb={4} display={'flex'} justifyContent={'center'} gap={1} alignItems={'center'}>
              <ArrowLeftButton disabled={model.backButtonDisabled} onClicked={handleBackClick} />
              <Typography variant='caption'>{dayjs(model.selectedDate).format('MM/DD/YYYY')}</Typography>
              <ArrowRightButton disabled={model.nextButtonDisabled} onClicked={handleNextClick} />
            </Box>
          )}
          <ScrollableBox scroller={scroller} maxHeight={maxHeight}>
            {model.earnings.map((item) => (
              <Box key={item.Symbol} pb={4} px={1}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
                  <Clickable
                    onClicked={() => {
                      handleClicked(item.Symbol)
                    }}
                  >
                    <Box>
                      <StockEarningsCompanyDisplay item={item} />
                      {item.StockQuote && <StockChange item={item.StockQuote} />}
                    </Box>
                  </Clickable>
                  <Box display={'flex'} pr={2} gap={2} pt={'4px'}>
                    <Box display={'flex'} flexDirection={'column'}>
                      <Typography variant='caption'>Actual</Typography>
                      <Typography textAlign={'right'} variant='caption' color={getPositiveNegativeColor(item.ActualEarnings, theme.palette.mode)}>
                        {item.ActualEarnings}
                      </Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'}>
                      <Typography variant='caption'>Estimate</Typography>
                      <Typography textAlign={'right'} variant='caption' color={getPositiveNegativeColor(item.EstimatedEarnings, theme.palette.mode)}>
                        {item.EstimatedEarnings}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </ScrollableBox>
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
