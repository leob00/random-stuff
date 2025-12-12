'use client'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import StockListItem, { getPositiveNegativeColor } from '../StockListItem'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { useEffect, useState } from 'react'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import { StockAdvancedSearchFilter } from '../advanced-search/advancedSearchFilter'
import { executeStockAdvancedSearch } from 'lib/backend/api/qln/qlnApi'
import { sleep } from 'lib/util/timers'
import { take } from 'lodash'
import { useSwrHelper } from 'hooks/useSwrHelper'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import Pager from 'components/Atoms/Pager'
import ScrollableBoxHorizontal from 'components/Atoms/Containers/ScrollableBoxHorizontal'
import SummaryTitle from './SummaryTitle'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'

const TopMoversSummary = () => {
  const theme = useTheme()
  const palette = theme.palette.mode

  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  // const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  //   const items = getPagedItems(data)
  //   const scroller = useScrollTop(0)
  const mutateKey = 'stock-market-summary-top-movers'
  const { pollCounter } = usePolling(1000 * 30)

  useEffect(() => {
    mutate(mutateKey)
  }, [pollCounter])

  const dataFn = async () => {
    let randomIntExclusive = Math.ceil(Math.random() * 450)
    if (randomIntExclusive < 250) {
      randomIntExclusive = 250 + Math.random() * 5
    }

    await sleep(randomIntExclusive)
    const topMoverFilter: StockAdvancedSearchFilter = {
      take: 50,
      marketCap: {
        includeLargeCap: true,
        includeMegaCap: true,
      },
      movingAvg: {
        days: 1,
      },
    }
    const topMoversResp = await executeStockAdvancedSearch(topMoverFilter)
    const result = topMoversResp.Body as StockQuote[]

    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box>
      <SummaryTitle title={'Top Movers'} />
      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Box minWidth={70} pl={1}>
            <Typography variant='caption'></Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>price</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>change</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>percent</Typography>
          </Box>
        </Box>
      </Box>
      {isLoading && (
        <Box display={'flex'} justifyContent={'center'}>
          <ComponentLoader />
        </Box>
      )}
      <ScrollableBox maxHeight={320}>
        {data && (
          <>
            {data.map((item) => (
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

      {selectedItem && (
        <InfoDialog show={true} title={selectedItem.Symbol} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem} marketCategory='stocks' userProfile={null} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

export default TopMoversSummary
