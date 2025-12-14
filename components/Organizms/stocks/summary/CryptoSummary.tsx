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
import { sortArray } from 'lib/util/collections'
import SummaryTitle from './SummaryTitle'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { filterCryptos } from 'components/Organizms/crypto/CryptosDisplay'
import { getRandomInteger } from 'lib/util/numberUtil'

const CryptoSummary = () => {
  const theme = useTheme()
  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  const palette = theme.palette.mode
  const mutateKey = 'crypto'

  const endPoint = `/Crypto`
  const dataFn = async () => {
    await sleep(getRandomInteger(250, 2500))
    const resp = await serverGetFetch(endPoint)
    const quotes = resp.Body as StockQuote[]
    const result = sortArray(quotes, ['ChangePercent'], ['desc'])
    return filterCryptos(result)
  }

  const { pollCounter } = usePolling(1000 * 240) // 4 minutes

  useEffect(() => {
    const fn = async () => {
      await sleep(250)
      mutate(mutateKey)
    }
    fn()
  }, [pollCounter])

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <Box>
      <SummaryTitle title={'Crypto'} />
      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Box minWidth={120} pl={1}>
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
      <ScrollableBox maxHeight={420}>
        {data && (
          <>
            {data.map((item) => (
              <Box key={item.Symbol}>
                <Box display={'flex'} gap={2} alignItems={'center'}>
                  <Button onClick={() => setSelectedItem(item)} sx={{ width: 120, justifyContent: 'flex-start' }}>
                    <Typography>{item.Company.substring(0, item.Company.indexOf(' - '))}</Typography>
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
        <InfoDialog show={true} title={selectedItem.Company} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem} marketCategory='crypto' userProfile={null} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

export default CryptoSummary
