import { Box, IconButton, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import BoxSkeleton from 'components/Atoms/Skeletons/BoxSkeleton'
import LinesSkeleton from 'components/Atoms/Skeletons/LinesSkeleton'
import {
  CasinoBlackTransparent,
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoDarkGreenTransparent,
  CasinoDarkRedTransparent,
  ChartBackground,
  DarkBlue,
  DarkBlueTransparent,
  DarkModeBlueTransparent,
} from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockChart from 'components/Organizms/stocks/StockChart'
import { Close } from '@mui/icons-material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { Table, TableBody, TableCell, TableRow } from '@aws-amplify/ui-react'

const StockListItem = ({ item, expand = false, showBorder = true }: { item: StockQuote; expand?: boolean; showBorder?: boolean }) => {
  const [showMore, setShowMore] = React.useState(expand)
  const [stockHistory, setStockHistory] = React.useState<StockHistoryItem[]>([])
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)
  const containerRef = React.useRef<HTMLElement | null>(null)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMore])
  const renderDetail = (label: string, val?: string | number | null) => {
    return (
      <>
        <Stack direction={'row'} spacing={2} py={1}>
          <Stack minWidth={80} textAlign={'right'}>
            <Typography color={CasinoBlueTransparent} fontWeight={300} variant={'body2'}>{`${label}:`}</Typography>
          </Stack>
          <Stack>
            <Typography variant={'body2'} fontWeight={600} color={CasinoBlue}>
              {val}
            </Typography>
          </Stack>
        </Stack>
      </>
    )
  }

  const handleCompanyClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined, show: boolean) => {
    setShowMore(show)
    if (show) {
      if (containerRef.current) {
        //containerRef.current.scrollIntoView()
      }
    }
  }

  return (
    <Box key={item.Symbol} py={1} ref={containerRef}>
      <Box
        pl={2}
        // sx={{
        //   borderRadius: '10px',
        //   border: !showMore ? `solid 1px ${getPositiveNegativeColor(item.Change)}` : '',
        // }}
      >
        <Stack direction={'row'} alignItems={'flex-start'} display={'flex'} pt={1} justifyContent={'space-between'}>
          <Stack sx={{ backgroundColor: ChartBackground }} direction={'row'} flexGrow={1} ml={-2} px={2} py={1}>
            <LinkButton
              onClick={(e) => {
                handleCompanyClick(e, !showMore)
              }}
            >
              <Typography ref={scrollTarget} textAlign={'left'} variant='h6' fontWeight={600} color={DarkBlue} sx={{ textDecoration: 'unset' }}>
                {`${item.Company}   (${item.Symbol})`}
              </Typography>
            </LinkButton>
          </Stack>
        </Stack>

        <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} pb={2} alignItems={'center'}>
          <Stack direction={'row'} spacing={2} pl={1} sx={{ backgroundColor: 'unset' }} pt={1}>
            <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.Price.toFixed(2)}`}</Typography>
            <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.Change.toFixed(2)}`}</Typography>
            <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.ChangePercent.toFixed(2)}%`}</Typography>
          </Stack>
        </Stack>
      </Box>
      {!showMore && <HorizontalDivider />}
      {showMore && (
        <>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <IconButton color='default' onClick={() => setShowMore(false)}>
              <Close fontSize='small' color={'secondary'} />
            </IconButton>
          </Box>
          <Box pl={1} sx={{ backgroundColor: 'unset' }} minHeight={108}>
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
          <Box pl={3} pb={2} pt={2}>
            {renderDetail('Sector', item.Sector)}
            {renderDetail('Cap', item.MarketCapShort)}
            {renderDetail('P/E', item.PeRatio)}
            {renderDetail('Date', dayjs(item.TradeDate).format('MM/DD/YYYY hh:mm a'))}
          </Box>
        </>
      )}
    </Box>
  )
}

export default StockListItem
