'use client'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import StockListItem, { getPositiveNegativeColor } from '../StockListItem'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { useState } from 'react'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import Pager from 'components/Atoms/Pager'
import { useClientPager } from 'hooks/useClientPager'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
const pageSize = 10
const PagedStockSummaryTable = ({ data, userProfile }: { data: StockQuote[]; userProfile: UserProfile | null }) => {
  const theme = useTheme()
  const palette = theme.palette.mode

  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
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
        {items && (
          <>
            {items.map((item) => (
              <Box key={item.Symbol}>
                <Box display={'flex'} gap={2} alignItems={'center'}>
                  <Button onClick={() => setSelectedItem(item)} sx={{ justifyContent: 'flex-start' }}>
                    <Typography>{item.Symbol}</Typography>
                  </Button>
                  <Box minWidth={80}>
                    <Typography color={getPositiveNegativeColor(item.Change, palette)}>{`${numeral(item.Price).format('###,###,0.00')}`}</Typography>
                  </Box>
                  <Box minWidth={80}>
                    <Typography color={getPositiveNegativeColor(item.Change, palette)}>{`${numeral(item.Change).format('###,###,0.00')}`}</Typography>
                  </Box>
                  <Box minWidth={80}>
                    <Typography color={getPositiveNegativeColor(item.Change, palette)}>{`${numeral(item.ChangePercent).format('###,###,0.00')}%`}</Typography>
                  </Box>
                </Box>
                <HorizontalDivider />
              </Box>
            ))}
          </>
        )}
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

      {selectedItem && (
        <InfoDialog show={true} title={selectedItem.Symbol} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem} marketCategory='stocks' userProfile={userProfile} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

export default PagedStockSummaryTable
