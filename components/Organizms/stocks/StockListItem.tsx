import { Box, IconButton, Stack, Typography } from '@mui/material'
import BoxSkeleton from 'components/Atoms/Skeletons/BoxSkeleton'
import LinesSkeleton from 'components/Atoms/Skeletons/LinesSkeleton'
import { CasinoBlackTransparent, CasinoBlueTransparent, CasinoDarkGreenTransparent, CasinoDarkRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockOrFutureChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockChart from 'components/Organizms/stocks/StockChart'
import Close from '@mui/icons-material/Close'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import StockNews from 'components/Organizms/stocks/StockNews'
import StockEarnings from './StockEarnings'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import CenterStack from 'components/Atoms/CenterStack'

const tabs: TabInfo[] = [{ title: 'Details', selected: true }, { title: 'Earnings' }, { title: 'News' }]
export const getPositiveNegativeColor = (val?: number | null) => {
  let color = CasinoBlackTransparent
  if (!val) {
    return color
  }
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
  isStock = true,
  showGroupName = true,
  closeOnCollapse = false,
  onClose,
}: {
  item: StockQuote
  expand?: boolean
  isStock: boolean
  showGroupName?: boolean
  closeOnCollapse?: boolean
  onClose?: () => void
}) => {
  const [showMore, setShowMore] = React.useState(expand)
  const [stockHistory, setStockHistory] = React.useState<StockHistoryItem[]>([])
  const [selectedTab, setSelectedTab] = React.useState('Details')
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)

  React.useEffect(() => {
    const fn = async () => {
      const history = await getStockOrFutureChart(item.Symbol, 90, isStock)
      setStockHistory(history)
      if (showMore) {
        if (scrollTarget.current) {
          scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
        }
      }
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
              <Typography color={CasinoBlueTransparent} variant={'body2'}>{`${label}:`}</Typography>
            </Stack>
            <Stack>
              <Typography variant={'body2'} color={'primary'}>
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
  }

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }
  const handleCollapseClick = () => {
    if (closeOnCollapse) {
      onClose?.()
    } else {
      setShowMore(false)
    }
  }

  return (
    <Box key={item.Symbol} py={1}>
      <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -12 }}></Typography>
      <Box>
        {isStock ? (
          <ListHeader text={`${item.Company}   (${item.Symbol})`} item={item} onClicked={(e) => handleCompanyClick(e, !showMore)} />
        ) : (
          <ListHeader text={`${item.Company}`} item={item} onClicked={(e) => handleCompanyClick(e, !showMore)} />
        )}

        <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} pb={2} alignItems={'center'}>
          <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
            <Typography variant='h5' color={getPositiveNegativeColor(item.Change)}>{`${item.Price.toFixed(2)}`}</Typography>
            <Typography variant='h5' color={getPositiveNegativeColor(item.Change)}>{`${item.Change.toFixed(2)}`}</Typography>
            <Typography variant='h5' color={getPositiveNegativeColor(item.Change)}>{`${item.ChangePercent.toFixed(2)}%`}</Typography>
          </Stack>
        </Stack>
        {showGroupName && item.GroupName && (
          <Stack pl={2}>
            <Typography variant='caption'>{`Group Name: ${item.GroupName}`}</Typography>
          </Stack>
        )}
      </Box>
      {!showMore && <HorizontalDivider />}
      {showMore && (
        <>
          <Box>
            <HorizontalDivider />
          </Box>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <IconButton color='default' onClick={handleCollapseClick}>
              <Close fontSize='small' color={'secondary'} />
            </IconButton>
          </Box>
          <Box pl={1} sx={{ backgroundColor: 'unset' }} minHeight={108}>
            {stockHistory.length > 0 ? (
              <>
                <StockChart symbol={item.Symbol} history={stockHistory} isStock={isStock} />
              </>
            ) : (
              <>
                <Box>
                  <CenterStack sx={{ pt: 6 }}>
                    <LinesSkeleton lines={1} width={200} />
                  </CenterStack>
                  <BoxSkeleton height={200} />
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
