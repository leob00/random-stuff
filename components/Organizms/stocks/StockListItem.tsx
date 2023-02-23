import { Box, ListItem, Paper, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BoxSkeleton from 'components/Atoms/Skeletons/BoxSkeleton'
import LinesSkeleton from 'components/Atoms/Skeletons/LinesSkeleton'
import PageWithGridSkeleton from 'components/Atoms/Skeletons/PageWithGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import {
  CasinoBlack,
  CasinoBlackTransparent,
  CasinoDarkGreenTransparent,
  CasinoDarkRedTransparent,
  CasinoGreen,
  CasinoGreenTransparent,
  CasinoRed,
  CasinoRedTransparent,
  DarkBlueTransparent,
  SoftWhite,
} from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockChart from './StockChart'

const StockListItem = ({ item, expand = false }: { item: StockQuote; expand?: boolean }) => {
  const [showMore, setShowMore] = React.useState(expand)
  const [stockHistory, setStockHistory] = React.useState<StockHistoryItem[]>([])

  const getPositiveNegativeColor = (val: number) => {
    let color = CasinoBlackTransparent
    if (val < 0) {
      color = CasinoDarkRedTransparent
    } else if (val > 0) {
      color = CasinoDarkGreenTransparent
    }
    return color
  }
  React.useEffect(() => {
    const fn = async () => {
      const history = await getStockChart(item.Symbol, 365)
      setStockHistory(history)
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
    setShowMore(show)
  }

  return (
    <Box key={item.Symbol} py={1}>
      <Box sx={{ py: 0 }}>
        <Box>
          <Box sx={{}}>
            <Box
              pl={2}
              sx={{
                //backgroundColor: SoftWhite,
                borderRadius: '10px',
                //borderTopRightRadius: '5px',
                border: `solid 1px ${getPositiveNegativeColor(item.Change)}`,
              }}
            >
              <LinkButton
                onClick={() => {
                  handleCompanyClick(item, !showMore)
                }}
              >
                <Stack direction={'row'} alignItems={'center'} display={'flex'} spacing={1} pt={1}>
                  <Stack>
                    <Typography textAlign={'left'} variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)} sx={{ textDecoration: 'unset' }}>
                      {`${item.Symbol} - ${item.Company}`}
                    </Typography>
                  </Stack>
                </Stack>
              </LinkButton>
              <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} pb={2} alignItems={'center'}>
                <Stack direction={'row'} spacing={2} pl={1} sx={{ backgroundColor: 'unset' }} pt={1}>
                  <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.Price.toFixed(2)}`}</Typography>
                  <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.Change.toFixed(2)}`}</Typography>
                  <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.ChangePercent.toFixed(2)}%`}</Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>
        {showMore && (
          <>
            <Box py={1} pl={1} sx={{ backgroundColor: 'unset' }}>
              {stockHistory.length > 0 ? (
                <>
                  <StockChart symbol={item.Symbol} history={stockHistory} />
                </>
              ) : (
                <>
                  <Box height={400}>
                    <LinesSkeleton lines={1} />
                    <BoxSkeleton />
                  </Box>
                </>
              )}
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
      </Box>
    </Box>
  )
}

export default StockListItem
