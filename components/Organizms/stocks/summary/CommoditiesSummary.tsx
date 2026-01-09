import { Box, Button, Typography, useTheme } from '@mui/material'
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
import SummaryTitle from './SummaryTitle'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { getRandomInteger } from 'lib/util/numberUtil'
import { StockSort } from './stocks/StockListSummary'
import { orderBy } from 'lodash'
import StockTooltip from 'components/Atoms/Tooltips/StockTooltip'
import OtherMarketsSummaryHeader from './OtherMarketsSummaryHeader'

const CommoditiesSummary = () => {
  const theme = useTheme()
  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  const palette = theme.palette.mode
  const mutateKey = 'commodities'
  const [stockSort, setStockSort] = useState<StockSort>({ field: 'ChangePercent', direction: 'default' })

  const dataFn = async () => {
    await sleep(getRandomInteger(250, 3000))
    const resp = await serverGetFetch(`/Futures`)
    const quotes = resp.Body as StockQuote[]
    const result = orderBy(quotes, (quote) => Math.abs(quote.ChangePercent), ['desc'])
    return sortList(result, stockSort)
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const sorted = sortList(data ?? [], stockSort)

  const pollingInterval = 1000 * 360 // 6 minutes
  const { pollCounter } = usePolling(getRandomInteger(pollingInterval, pollingInterval + 10000))

  const handleSortClick = (sort: StockSort) => {
    setStockSort(sort)
  }
  const onRefreshRequest = () => {
    mutate(mutateKey)
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
      <SummaryTitle title={'Commodities'} onRefresh={onRefreshRequest} />
      <OtherMarketsSummaryHeader stockSort={stockSort} handleSortClick={handleSortClick} />
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
        <InfoDialog show={true} title={''} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem} marketCategory='commodities' userProfile={null} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}
function sortList(data: StockQuote[], sort: StockSort) {
  if (sort.direction === 'default') {
    return data
  } else {
    return orderBy(data, [sort.field], [sort.direction])
  }
}
export default CommoditiesSummary
