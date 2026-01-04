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
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import StockTooltip from 'components/Atoms/Tooltips/StockTooltip'
const pageSize = 10
const PagedStockEarningsSummaryTable = ({ data, userProfile, singleDate }: { data: StockEarning[]; userProfile: UserProfile | null; singleDate?: boolean }) => {
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
      <Box minHeight={330}>
        <ScrollableBox maxHeight={308} scroller={scroller}>
          {items.map((item) => (
            <Box key={item.Symbol}>
              <Box display={'flex'} gap={1} alignItems={'center'}>
                <Box minWidth={68}>
                  <StockTooltip data={item.StockQuote!}>
                    <Button size='small' onClick={() => setSelectedItem(item)} sx={{ justifyContent: 'flex-start' }}>
                      <Typography variant='body2'>{item.Symbol}</Typography>
                    </Button>
                  </StockTooltip>
                </Box>
                <Box minWidth={70}>
                  <Typography
                    variant={'body2'}
                    color={getPositiveNegativeColor(item.ActualEarnings, palette)}
                  >{`${item.ActualEarnings !== null ? numeral(item.ActualEarnings).format('###,###,0.00') : ''}`}</Typography>
                </Box>
                <Box minWidth={70}>
                  <Typography
                    color={getPositiveNegativeColor(item.EstimatedEarnings, palette)}
                    variant={'body2'}
                  >{`${item.EstimatedEarnings !== null ? numeral(item.EstimatedEarnings).format('###,###,0.00') : ''}`}</Typography>
                </Box>
                {!singleDate && (
                  <Box minWidth={80}>
                    <Typography variant='caption'>{`${dayjs(item.ReportDate).format('MM/DD/YYYY')}`}</Typography>
                  </Box>
                )}
              </Box>
              <HorizontalDivider />
            </Box>
          ))}
        </ScrollableBox>
      </Box>
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
          <StockListItem item={selectedItem.StockQuote} marketCategory='stocks' userProfile={userProfile} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

export default PagedStockEarningsSummaryTable
