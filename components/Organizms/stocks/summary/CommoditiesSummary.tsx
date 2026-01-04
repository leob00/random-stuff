import { Box, Button, IconButton, Stack, Typography, useTheme } from '@mui/material'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import { useEffect, useState } from 'react'
import StockListItem, { getPositiveNegativeColor } from '../StockListItem'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import { sleep } from 'lib/util/timers'
import { sortArray } from 'lib/util/collections'
import SummaryTitle from './SummaryTitle'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { getRandomInteger } from 'lib/util/numberUtil'
import ScrollableBoxHorizontal from 'components/Atoms/Containers/ScrollableBoxHorizontal'
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { StockSortDirection } from './stocks/StockListSummary'
import { orderBy } from 'lodash'
import StockTooltip from 'components/Atoms/Tooltips/StockTooltip'

const CommoditiesSummary = () => {
  const theme = useTheme()
  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  const palette = theme.palette.mode
  const mutateKey = 'commodities'
  const [sortDirection, setSortDirection] = useState<StockSortDirection>('default')

  const dataFn = async () => {
    await sleep(getRandomInteger(250, 3000))
    const resp = await serverGetFetch(`/Futures`)
    const quotes = resp.Body as StockQuote[]
    const result = orderBy(quotes, (quote) => Math.abs(quote.ChangePercent), ['desc'])
    return sortList(result, sortDirection)
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const sorted = sortList(data ?? [], sortDirection)

  const pollingInterval = 1000 * 360 // 6 minutes
  const { pollCounter } = usePolling(getRandomInteger(pollingInterval, pollingInterval + 10000))

  const handleSortClick = () => {
    if (sortDirection === 'default') {
      setSortDirection('desc')
    }

    if (sortDirection === 'desc') {
      setSortDirection('asc')
    }
    if (sortDirection === 'asc') {
      setSortDirection('default')
    }
  }

  useEffect(() => {
    const fn = async () => {
      await sleep(250)
      mutate(mutateKey)
    }
    fn()
  }, [pollCounter])

  return (
    <Box height={513}>
      <SummaryTitle title={'Commodities'} />
      <ScrollableBoxHorizontal>
        <Box display={'flex'} gap={1} alignItems={'center'} minHeight={44}>
          <Box minWidth={120} pl={1}>
            <Typography variant='caption'></Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>price</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>change</Typography>
          </Box>
          <Box minWidth={80} display={'flex'} alignItems={'center'} gap={1}>
            <Typography variant='caption'>%</Typography>
            {sortDirection === 'default' && (
              <IconButton onClick={handleSortClick}>
                <SwapVertRoundedIcon color='primary' sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            {sortDirection === 'desc' && (
              <IconButton onClick={handleSortClick}>
                <ArrowDownwardIcon color='primary' sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            {sortDirection === 'asc' && (
              <IconButton onClick={handleSortClick}>
                <ArrowUpwardIcon color='primary' sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Box>
        </Box>
        {isLoading && (
          <Box display={'flex'} justifyContent={'center'}>
            <ComponentLoader />
          </Box>
        )}
        {data && (
          <Box pt={2}>
            {sorted.map((item, index) => (
              <Box key={item.Symbol}>
                <Box display={'flex'} gap={1} alignItems={'center'}>
                  <Box minWidth={120}>
                    <StockTooltip data={item}>
                      <Button size='small' onClick={() => setSelectedItem(item)} sx={{ justifyContent: 'flex-start' }}>
                        <Typography variant='body2'>{item.Company}</Typography>
                      </Button>
                    </StockTooltip>
                  </Box>
                  <Box minWidth={80}>
                    <Typography
                      variant='body2'
                      color={getPositiveNegativeColor(item.Change, palette)}
                    >{`${numeral(item.Price).format('###,###,0.00')}`}</Typography>
                  </Box>
                  <Box minWidth={80}>
                    <Typography
                      variant='body2'
                      color={getPositiveNegativeColor(item.Change, palette)}
                    >{`${numeral(item.Change).format('###,###,0.00')}`}</Typography>
                  </Box>
                  <Box minWidth={80}>
                    <Typography
                      variant='body2'
                      color={getPositiveNegativeColor(item.Change, palette)}
                    >{`${numeral(item.ChangePercent).format('###,###,0.00')}%`}</Typography>
                  </Box>
                </Box>
                {index < data.length - 1 && <HorizontalDivider />}
              </Box>
            ))}
          </Box>
        )}
        {selectedItem && (
          <InfoDialog show={true} title={selectedItem.Company} onCancel={() => setSelectedItem(null)}>
            <StockListItem item={selectedItem} marketCategory='commodities' userProfile={null} disabled expand />
          </InfoDialog>
        )}
      </ScrollableBoxHorizontal>
    </Box>
  )
}
function sortList(data: StockQuote[], direction: StockSortDirection) {
  if (direction === 'default') {
    return data
  }
  return sortArray(data, ['ChangePercent'], [direction])
}
export default CommoditiesSummary
