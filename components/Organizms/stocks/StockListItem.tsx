import { Box, ListItem, Paper, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import PageWithGridSkeleton from 'components/Atoms/Skeletons/PageWithGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { CasinoBlack, CasinoBlackTransparent, CasinoGreen, DarkBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockChart from './StockChart'

const StockListItem = ({ item, expand = false }: { item: StockQuote; expand?: boolean }) => {
  //const [quote, setQuote] = React.useState(item)
  const [showMore, setShowMore] = React.useState(expand)
  const [stockHistory, setStockHistory] = React.useState<StockHistoryItem[]>([])

  const getPositiveNegativeColor = (val: number) => {
    let color = CasinoBlack
    if (val < 0) {
      color = '#980036'
    } else if (val > 0) {
      color = CasinoGreen
    }
    return color
  }
  React.useEffect(() => {
    const fn = async () => {
      if (showMore) {
        const history = await getStockChart(item.Symbol, 365)
        setStockHistory(history)
      }
    }
    if (showMore) {
      fn()
    }
  }, [showMore])

  const renderDetail = (label: string, val?: string | number | null) => {
    return (
      <Stack direction={'row'} spacing={1} py={1}>
        <Stack>
          <Typography variant={'body2'}>{`${label}:`}</Typography>
        </Stack>
        <Stack>
          <Typography variant={'body2'} fontWeight={600} color={DarkBlueTransparent}>
            {val}
          </Typography>
        </Stack>
      </Stack>
    )
  }

  const handleCompanyClick = async (stockQuote: StockQuote, show: boolean) => {
    /*  if (show) {
      const history = await getStockChart(stockQuote.Symbol, 365)
      setStockHistory(history)
    } */
    setShowMore(show)
  }

  return (
    <Box key={item.Symbol} py={2}>
      <Paper sx={{ py: 1 }}>
        <Box>
          <Box sx={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px', backgroundColor: 'unset' }}>
            <Box>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
                <LinkButton
                  onClick={() => {
                    handleCompanyClick(item, !showMore)
                  }}
                >
                  <Typography textAlign={'left'} variant='h6'>
                    {`${item.Symbol}: ${item.Company}`}
                  </Typography>
                </LinkButton>
                {/*   <ListItemText primary={`${item.Symbol}: ${item.Company}`}></ListItemText>*/}
              </ListItem>
            </Box>
            <Stack direction={'row'} spacing={1} sx={{ backgroundColor: 'unset', minWidth: '25%' }} pt={1} pl={1} alignItems={'center'}>
              <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }}>
                <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.Price.toFixed(2)}`}</Typography>
                <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.Change.toFixed(2)}`}</Typography>
                <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.ChangePercent.toFixed(2)}%`}</Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>{' '}
        {showMore && (
          <>
            <Box py={1} pl={1} sx={{ backgroundColor: 'unset' }}>
              <Box minHeight={400}>
                {stockHistory.length > 0 ? (
                  <StockChart symbol={item.Symbol} history={stockHistory} />
                ) : (
                  <>
                    <PageWithGridSkeleton />
                  </>
                )}
              </Box>
            </Box>
            <Box pl={3}>
              {renderDetail('Sector', item.Sector)}
              {renderDetail('Cap', item.MarketCapShort)}
              {renderDetail('P/E', item.PeRatio)}
            </Box>
            <Stack direction={'row'} spacing={1} py={1} pl={3}>
              <Stack>
                <Typography fontSize={12} color={CasinoBlackTransparent}>
                  {dayjs(item.TradeDate).format('MM/DD/YYYY hh:mm a')}
                </Typography>
              </Stack>
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default StockListItem
