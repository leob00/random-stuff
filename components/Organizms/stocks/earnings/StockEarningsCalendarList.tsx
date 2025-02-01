import { Box, Typography } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { filterResult, getDefaultDateOption } from './earningsCalendar'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import StockEarningsCalendarDetails from './StockEarningsCalendarDetails'
import StockEarningsCompanyDisplay from './StockEarningsCompanyDisplay'
import StockChange from '../StockChange'
import { useClientPager } from 'hooks/useClientPager'
import Pager from 'components/Atoms/Pager'
import { orderBy, uniq } from 'lodash'
import { useState } from 'react'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import Clickable from 'components/Atoms/Containers/Clickable'
import { useRouter } from 'next/navigation'
import HoverEffect from 'components/Molecules/Lists/HoverEffect'
import dayjs from 'dayjs'

const StockEarningsCalendarList = ({ data }: { data: StockEarning[] }) => {
  const uniqueDates = orderBy(uniq(data.map((m) => m.ReportDate!)))
  const dateToSelect = getDefaultDateOption(data)
  const [selectedDate, setSelectedDate] = useState(dateToSelect)
  let filtered = filterResult(data, dateToSelect)
  filtered = orderBy(filtered, ['StockQuote.MarketCap'], ['desc'])
  const pageSize = 3
  const { getPagedItems, setPage, pagerModel } = useClientPager(filtered, pageSize)
  const pagedItems = getPagedItems(filtered)
  const scroller = useScrollTop(0)
  const router = useRouter()

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }

  const handleClicked = async (item: string) => {
    router.push(`/csr/stocks/details/${item}`)
  }

  return (
    <Box>
      {dateToSelect && (
        <Box pb={4} my={-1} display={'flex'} justifyContent={'center'}>
          <Typography variant='caption'>{dayjs(dateToSelect).format('MM/DD/YYYY')}</Typography>
        </Box>
      )}
      {pagedItems.map((item) => (
        <Box key={item.Symbol} pb={4} px={1}>
          <HoverEffect>
            <Clickable
              onClicked={() => {
                handleClicked(item.Symbol)
              }}
            >
              <StockEarningsCompanyDisplay item={item} />
              {item.StockQuote && (
                <FadeIn>
                  <StockChange item={item.StockQuote} />
                </FadeIn>
              )}
            </Clickable>
          </HoverEffect>
        </Box>
      ))}
      <Pager
        pageCount={pagerModel.totalNumberOfPages}
        itemCount={pageSize}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pagerModel.page}
        totalItemCount={pagerModel.totalNumberOfItems}
      ></Pager>
    </Box>
  )
}

export default StockEarningsCalendarList
