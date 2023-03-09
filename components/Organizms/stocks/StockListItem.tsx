import { Box, IconButton, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import BoxSkeleton from 'components/Atoms/Skeletons/BoxSkeleton'
import LinesSkeleton from 'components/Atoms/Skeletons/LinesSkeleton'
import { CasinoBlackTransparent, CasinoDarkGreenTransparent, CasinoDarkRedTransparent, DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockChart from 'components/Organizms/stocks/StockChart'
import { Close } from '@mui/icons-material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

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
  }, [showMore])

  const renderDetail = (label: string, val?: string | number | null) => {
    return (
      <Stack direction={'row'} spacing={1} py={1}>
        <Stack>
          <Typography color={DarkBlueTransparent} fontWeight={600} variant={'body2'}>{`${label}:`}</Typography>
        </Stack>
        <Stack>
          <Typography variant={'body2'} fontWeight={600} color={DarkBlue}>
            {val}
          </Typography>
        </Stack>
      </Stack>
    )
  }

  const handleCompanyClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined, show: boolean) => {
    setShowMore(show)
    if (show) {
      if (containerRef.current) {
        //containerRef.current.scrollIntoView()
      }
      if (e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect().bottom
        // var elementPosition = element.getBoundingClientRect().top
        //console.log(' window.pageYOffset: ', window.pageYOffset)
        var offsetPosition = rect + window.pageYOffset - 100
        //e.currentTarget.scrollTop = 0
        //e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start' })
        // console.log('rect: ', rect)
        //window.scroll({ top: rect.y })
        //window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }
  }

  return (
    <Box key={item.Symbol} py={1} ref={containerRef}>
      {showMore && <HorizontalDivider />}
      <Box
        pl={2}
        sx={{
          borderRadius: '10px',
          border: !showMore ? `solid 1px ${getPositiveNegativeColor(item.Change)}` : '',
        }}
      >
        <Stack direction={'row'} alignItems={'center'} display={'flex'} pt={1}>
          <LinkButton
            onClick={(e) => {
              handleCompanyClick(e, !showMore)
            }}
          >
            <Typography ref={scrollTarget} textAlign={'left'} variant='h6' fontWeight={600} color={DarkBlue} sx={{ textDecoration: 'unset' }}>
              {`${item.Company}   (${item.Symbol})`}
            </Typography>
          </LinkButton>
          <Stack alignItems={'flex-end'} flexGrow={1}>
            {showMore && (
              <IconButton color='default' onClick={() => setShowMore(false)}>
                <Close fontSize='small' />
              </IconButton>
            )}
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
      {showMore && (
        <>
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
          <Box pl={3} pb={2}>
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
