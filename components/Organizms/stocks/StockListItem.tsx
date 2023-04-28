import { Box, IconButton, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import BoxSkeleton from 'components/Atoms/Skeletons/BoxSkeleton'
import LinesSkeleton from 'components/Atoms/Skeletons/LinesSkeleton'
import {
  CasinoBlackTransparent,
  CasinoBlueTransparent,
  CasinoDarkGreenTransparent,
  CasinoDarkRedTransparent,
  ChartBackground,
  DarkBlue,
} from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockOrFutureChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockChart from 'components/Organizms/stocks/StockChart'
import { Close } from '@mui/icons-material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import StockNews from 'components/Organizms/stocks/StockNews'
import StockEarnings from './StockEarnings'
import ListHeader from 'components/Molecules/Lists/ListHeader'

const tabs: TabInfo[] = [{ title: 'Details', selected: true }, { title: 'News' }, { title: 'Earnings' }]
export const getPositiveNegativeColor = (val: number) => {
  let color = CasinoBlackTransparent
  if (val < 0) {
    color = CasinoDarkRedTransparent
  } else if (val > 0) {
    color = CasinoDarkGreenTransparent
  }
  return color
}
const StockListItem = ({
  item,
  expand = false,
  showBorder = true,
  isStock = true,
}: {
  item: StockQuote
  expand?: boolean
  showBorder?: boolean
  isStock: boolean
}) => {
  const [showMore, setShowMore] = React.useState(expand)
  const [stockHistory, setStockHistory] = React.useState<StockHistoryItem[]>([])
  const [selectedTab, setSelectedTab] = React.useState('Details')
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)

  React.useEffect(() => {
    const fn = async () => {
      const history = await getStockOrFutureChart(item.Symbol, 90, isStock)
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
        {val && (
          <Stack direction={'row'} spacing={2} py={1} alignItems={'center'}>
            <Stack minWidth={80} textAlign={'right'}>
              <Typography color={CasinoBlueTransparent} variant={'body2'} fontSize={12}>{`${label}:`}</Typography>
            </Stack>
            <Stack>
              <Typography variant={'body2'} color={'primary'} fontSize={12}>
                {val}
              </Typography>
            </Stack>
          </Stack>
        )}
      </>
    )
  }

  const handleCompanyClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined, show: boolean) => {
    setShowMore(show)
    if (show) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView()
      }
    }
  }

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }

  return (
    <Box key={item.Symbol} py={1}>
      <Box pl={2}>
        {isStock ? (
          <ListHeader text={`${item.Company}   (${item.Symbol})`} item={item} onClicked={(e) => handleCompanyClick(e, !showMore)} />
        ) : (
          <ListHeader text={`${item.Company}`} item={item} onClicked={(e) => handleCompanyClick(e, !showMore)} />
        )}
        <Typography ref={scrollTarget}></Typography>
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
                <StockChart symbol={item.Symbol} history={stockHistory} companyName={item.Company} isStock={isStock} />
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
          {isStock && (
            <>
              <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
              {selectedTab === 'Details' && (
                <Box pb={2} pt={2}>
                  {renderDetail('Sector', item.Sector)}
                  {renderDetail('Cap', item.MarketCapShort)}
                  {renderDetail('P/E', item.PeRatio)}
                  {renderDetail('Date', dayjs(item.TradeDate).format('MM/DD/YYYY hh:mm a'))}
                </Box>
              )}
              {selectedTab === 'News' && <StockNews quote={item} />}
              {selectedTab === 'Earnings' && <StockEarnings quote={item} />}
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default StockListItem
