'use client'
import { Box, Button, Typography, useTheme } from '@mui/material'
import numeral from 'numeral'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { useState } from 'react'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import Pager from 'components/Atoms/Pager'
import { useClientPager } from 'hooks/useClientPager'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import StockListItem, { getPositiveNegativeColor } from '../../StockListItem'
import dayjs from 'dayjs'
const pageSize = 10
const PagedStockEarningsSummaryTable = ({ data }: { data: StockEarning[] }) => {
  const theme = useTheme()
  const palette = theme.palette.mode

  const [selectedItem, setSelectedItem] = useState<StockEarning | null>(null)
  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  const items = getPagedItems(data)
  const scroller = useScrollTop(0)

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }

  return (
    <Box>
      <ScrollableBox maxHeight={320} scroller={scroller}>
        {items.map((item) => (
          <Box key={item.Symbol}>
            <Box display={'flex'} gap={2} alignItems={'center'}>
              <Button onClick={() => setSelectedItem(item)} sx={{ justifyContent: 'flex-start' }}>
                <Typography>{item.Symbol}</Typography>
              </Button>
              <Box minWidth={80}>
                <Typography
                  color={getPositiveNegativeColor(item.ActualEarnings, palette)}
                >{`${item.ActualEarnings !== null ? numeral(item.ActualEarnings).format('###,###,0.00') : ''}`}</Typography>
              </Box>
              <Box minWidth={80}>
                <Typography
                  color={getPositiveNegativeColor(item.EstimatedEarnings, palette)}
                >{`${item.EstimatedEarnings !== null ? numeral(item.EstimatedEarnings).format('###,###,0.00') : ''}`}</Typography>
              </Box>
              <Box minWidth={120}>
                <Typography variant='caption'>{`${dayjs(item.ReportDate).format('MM/DD/YYYY')}`}</Typography>
              </Box>
            </Box>
            <HorizontalDivider />
          </Box>
        ))}
      </ScrollableBox>
      <Pager
        pageCount={pagerModel.totalNumberOfPages}
        itemCount={items.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pagerModel.page}
        totalItemCount={pagerModel.totalNumberOfItems}
        showHorizontalDivider={false}
      ></Pager>

      {selectedItem && selectedItem.StockQuote && (
        <InfoDialog show={true} title={selectedItem.Symbol} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem.StockQuote} marketCategory='stocks' userProfile={null} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

export default PagedStockEarningsSummaryTable
