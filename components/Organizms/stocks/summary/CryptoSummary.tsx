import { Box, Button, IconButton, Stack, Typography, useTheme } from '@mui/material'
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
import { sortArray } from 'lib/util/collections'
import SummaryTitle from './SummaryTitle'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { filterCryptos } from 'components/Organizms/crypto/CryptosDisplay'
import { getRandomInteger } from 'lib/util/numberUtil'
import ScrollableBoxHorizontal from 'components/Atoms/Containers/ScrollableBoxHorizontal'
import { StockSortDirection } from './stocks/StockListSummary'
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import StockTooltip from 'components/Atoms/Tooltips/StockTooltip'

const CryptoSummary = () => {
  const theme = useTheme()
  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  const [sortDirection, setSortDirection] = useState<StockSortDirection>('default')
  const palette = theme.palette.mode
  const mutateKey = 'crypto'

  const endPoint = `/Crypto`
  const dataFn = async () => {
    await sleep(getRandomInteger(250, 2500))
    const resp = await serverGetFetch(endPoint)
    const quotes = resp.Body as StockQuote[]

    const result = filterCryptos(quotes)
    return sortList(result, sortDirection)
  }

  const { pollCounter } = usePolling(1000 * 240) // 4 minutes
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

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const sorted = sortList(data ?? [], sortDirection)

  return (
    <Box height={690}>
      <SummaryTitle title={'Crypto'} />
      <ScrollableBoxHorizontal>
        <Box>
          <Box display={'flex'} gap={1} alignItems={'center'} minHeight={44}>
            <Box minWidth={110} pl={1}>
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
        </Box>
        {isLoading && (
          <Box display={'flex'} justifyContent={'center'}>
            <ComponentLoader />
          </Box>
        )}
        {data && (
          <Box pt={2}>
            {sorted.map((item, index) => (
              <Stack key={item.Symbol} width={'100%'}>
                <Stack>
                  <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Box minWidth={110}>
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
                </Stack>
              </Stack>
            ))}
          </Box>
        )}
        {selectedItem && (
          <InfoDialog show={true} title={''} onCancel={() => setSelectedItem(null)}>
            <StockListItem item={selectedItem} marketCategory='crypto' userProfile={null} disabled expand />
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
export default CryptoSummary
