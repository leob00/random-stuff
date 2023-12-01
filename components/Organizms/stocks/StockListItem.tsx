import { Box, IconButton, Stack, Typography } from '@mui/material'
import {
  CasinoBlackTransparent,
  CasinoDarkGreenTransparent,
  CasinoDarkRedTransparent,
  CasinoLimeTransparent,
  CasinoOrange,
  VeryLightBlue,
} from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockOrFutureChart } from 'lib/backend/api/qln/chartApi'
import React from 'react'
import StockChart from 'components/Organizms/stocks/StockChart'
import Close from '@mui/icons-material/Close'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import StockNews from 'components/Organizms/stocks/StockNews'
import StockEarnings from './StockEarnings'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { putSearchedStock } from 'lib/backend/csr/nextApiWrapper'
import { useTheme } from '@mui/material'
import CompanyProfile from './CompanyProfile'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import StockSubscibeIcon from './StockSubscibeIcon'
import { useUserController } from 'hooks/userController'

const tabs: TabInfo[] = [{ title: 'Details', selected: true }, { title: 'Earnings' }, { title: 'News' }, { title: 'Profile' }]
export const getPositiveNegativeColor = (val?: number | null, mode: 'light' | 'dark' = 'light') => {
  let color = mode === 'light' ? CasinoBlackTransparent : VeryLightBlue
  if (!val) {
    return color
  }
  if (val < 0) {
    color = mode === 'light' ? CasinoDarkRedTransparent : CasinoOrange
  } else if (val > 0) {
    color = mode === 'light' ? CasinoDarkGreenTransparent : CasinoLimeTransparent
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
  scrollIntoView = true,
  showDetailCollapse = true,
  disabled,
}: {
  item: StockQuote
  expand?: boolean
  isStock: boolean
  showGroupName?: boolean
  closeOnCollapse?: boolean
  onClose?: () => void
  scrollIntoView?: boolean
  showDetailCollapse?: boolean
  disabled?: boolean
}) => {
  const { authProfile } = useUserController()
  const [showMore, setShowMore] = React.useState(expand)
  const [stockHistory, setStockHistory] = React.useState<StockHistoryItem[]>([])
  const [selectedTab, setSelectedTab] = React.useState('Details')
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)
  const tabScrollTarget = React.useRef<HTMLSpanElement | null>(null)
  const theme = useTheme()
  React.useEffect(() => {
    let isCanceled = false
    const fn = async () => {
      if (showMore && scrollIntoView && !isCanceled) {
        if (scrollTarget.current) {
          scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
        }
      }
      const history = await getStockOrFutureChart(item.Symbol, 90, isStock)
      if (isStock) {
        putSearchedStock(item)
      }
      setStockHistory(history)
    }
    if (showMore) {
      fn()
    }
    return () => {
      isCanceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMore])

  const handleCompanyClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined, show: boolean) => {
    if (!disabled) {
      setShowMore(show)
    }
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

  React.useEffect(() => {
    if (tabScrollTarget.current) {
      if (selectedTab !== 'Details') {
        tabScrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [selectedTab])

  return (
    <Box key={item.Symbol} py={1}>
      <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -12 }}></Typography>
      <Box>
        {isStock ? (
          <ListHeader text={`${item.Company} (${item.Symbol})`} item={item} onClicked={(e) => handleCompanyClick(e, !showMore)} />
        ) : (
          <ListHeader text={`${item.Company}`} item={item} onClicked={(e) => handleCompanyClick(e, !showMore)} />
        )}

        <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} pb={2} alignItems={'center'}>
          <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
            <Typography variant='h5' color={getPositiveNegativeColor(item.Change, theme.palette.mode)}>{`${item.Price.toFixed(2)}`}</Typography>
            <Typography variant='h5' color={getPositiveNegativeColor(item.Change, theme.palette.mode)}>{`${item.Change.toFixed(2)}`}</Typography>
            <Typography variant='h5' color={getPositiveNegativeColor(item.Change, theme.palette.mode)}>{`${item.ChangePercent.toFixed(2)}%`}</Typography>
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
          {showDetailCollapse && (
            <Box display={'flex'} justifyContent={'flex-end'}>
              <IconButton color='default' onClick={handleCollapseClick}>
                <Close fontSize='small' color={'secondary'} />
              </IconButton>
            </Box>
          )}
          <Box pl={1} sx={{ backgroundColor: 'unset' }} minHeight={{ xs: 300, sm: 600 }}>
            {stockHistory.length > 0 && (
              <>
                <StockChart symbol={item.Symbol} history={stockHistory} isStock={isStock} />
              </>
            )}
          </Box>
          {isStock && (
            <>
              {authProfile && (
                <>
                  <StockSubscibeIcon userProfile={authProfile} quote={item} />
                </>
              )}
              <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
              <Typography ref={tabScrollTarget} sx={{ position: 'absolute', mt: -20 }}></Typography>
              {selectedTab === 'Details' && (
                <Box pb={2} pt={2}>
                  <ReadOnlyField label={'Sector'} val={item.Sector} />
                  <ReadOnlyField label={'Cap'} val={item.MarketCapShort} />
                  <ReadOnlyField label={'P/E'} val={item.PeRatio} />
                  <ReadOnlyField label={'Date'} val={dayjs(item.TradeDate).format('MM/DD/YYYY hh:mm a')} />
                </Box>
              )}
              {selectedTab === 'News' && <StockNews quote={item} />}
              {selectedTab === 'Earnings' && <StockEarnings quote={item} />}
              {selectedTab === 'Profile' && <CompanyProfile quote={item} />}
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default StockListItem
