import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
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
import { filterCryptos } from 'components/Organizms/crypto/CryptosDisplay'
import { formatDecimal, getRandomInteger } from 'lib/util/numberUtil'
import { StockSort } from './stocks/StockListSummary'
import StockTooltip from 'components/Atoms/Tooltips/StockTooltip'
import OtherMarketsSummaryHeader from './OtherMarketsSummaryHeader'
import { orderBy } from 'lodash'

const CryptoSummary = () => {
  const theme = useTheme()
  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  const [stockSort, setStockSort] = useState<StockSort>({ field: 'ChangePercent', direction: 'default' })
  const palette = theme.palette.mode
  const mutateKey = 'crypto'

  const endPoint = `/Crypto`
  const dataFn = async () => {
    await sleep(getRandomInteger(250, 2500))
    const resp = await serverGetFetch(endPoint)
    const quotes = resp.Body as StockQuote[]

    const result = filterCryptos(quotes)
    return sortList(result, stockSort)
  }

  const { pollCounter } = usePolling(1000 * 240) // 4 minutes
  const handleSortClick = (sort: StockSort) => {
    setStockSort(sort)
  }
  useEffect(() => {
    const fn = async () => {
      await sleep(250)
      mutate(mutateKey)
    }
    if (pollCounter > 1) {
      fn()
    }
  }, [pollCounter])

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const sorted = sortList(data ?? [], stockSort)
  const onRefreshRequest = () => {
    mutate(mutateKey)
  }

  return (
    <Box height={513}>
      <SummaryTitle title={'Crypto'} onRefresh={onRefreshRequest} />
      <OtherMarketsSummaryHeader stockSort={stockSort} handleSortClick={handleSortClick} />
      {isLoading && (
        <Box display={'flex'} justifyContent={'center'}>
          <ComponentLoader />
        </Box>
      )}
      {data && (
        <Box>
          <ScrollableBox maxHeight={320}>
            {sorted.map((item, index) => (
              <Stack key={item.Symbol} width={'100%'}>
                <Stack>
                  <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Box minWidth={120}>
                      <StockTooltip data={item}>
                        <Button size='small' onClick={() => setSelectedItem(item)} sx={{ justifyContent: 'flex-start' }}>
                          <Typography variant='body2'>{item.Company.substring(0, item.Company.indexOf(' - '))}</Typography>
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
                      >{`${formatDecimal(item.Change, item.Price <= 1 ? 3 : 2)}`}</Typography>
                    </Box>
                    <Box minWidth={80}>
                      <Typography
                        variant='body2'
                        color={getPositiveNegativeColor(item.Change, palette)}
                      >{`${formatDecimal(item.ChangePercent, item.Price <= 1 ? 3 : 2)}%`}</Typography>
                    </Box>
                  </Box>
                  {index < data.length - 1 && <HorizontalDivider />}
                </Stack>
              </Stack>
            ))}
          </ScrollableBox>
        </Box>
      )}
      {selectedItem && (
        <InfoDialog show={true} title={''} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem} marketCategory='crypto' userProfile={null} disabled expand />
        </InfoDialog>
      )}
      {/* </ScrollableBoxHorizontal> */}
    </Box>
  )
}
function sortList(data: StockQuote[], sort: StockSort) {
  if (sort.direction === 'default') {
    const res = orderBy(data, (m) => Math.abs(m.ChangePercent), ['desc'])
    return res
  } else {
    return orderBy(data, [sort.field], [sort.direction])
  }
}
export default CryptoSummary
