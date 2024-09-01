import { Box, Stack, Typography } from '@mui/material'
import {
  CasinoBlackTransparent,
  CasinoDarkGreenTransparent,
  CasinoDarkRedTransparent,
  CasinoLimeTransparent,
  CasinoOrange,
  VeryLightBlue,
} from 'components/themes/mainTheme'

import { StockHistoryItem, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockOrFutureChart } from 'lib/backend/api/qln/chartApi'
import StockChart from 'components/Organizms/stocks/StockChart'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import StockNews from 'components/Organizms/stocks/StockNews'
import StockEarnings from './earnings/StockEarnings'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { putSearchedStock } from 'lib/backend/csr/nextApiWrapper'
import CompanyProfile from './CompanyProfile'
import StockSubscibeIcon from './StockSubscibeIcon'
import { useUserController } from 'hooks/userController'
import TabList from 'components/Atoms/Buttons/TabList'
import StockChange from './StockChange'
import StockDetailsTab from './StockDetailsTab'
import { useEffect, useRef, useState } from 'react'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StockDividendDetails from './dividends/StockDividendDetails'
import StockField from './StockField'

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
  scrollIntoView = true,
  disabled,
  featuredField,
}: {
  item: StockQuote
  expand?: boolean
  isStock: boolean
  showGroupName?: boolean
  scrollIntoView?: boolean
  disabled?: boolean
  featuredField?: keyof StockQuote
}) => {
  let tabs: TabInfo[] = [{ title: 'Details', selected: true }, { title: 'Earnings' }, { title: 'News' }, { title: 'Profile' }]
  if (item.AnnualDividendYield) {
    const div: TabInfo = {
      title: 'Dividends',
    }
    tabs.splice(2, 0, div)
  }

  const { authProfile, fetchProfilePassive, setProfile } = useUserController()
  const [showMore, setShowMore] = useState(expand)
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([])
  const [selectedTab, setSelectedTab] = useState('Details')
  const scrollTarget = useRef<HTMLSpanElement | null>(null)
  const tabScrollTarget = useRef<HTMLSpanElement | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const p = await fetchProfilePassive()
        setProfile(p)
      }
      setIsLoadingProfile(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  useEffect(() => {
    const fn = async () => {
      if (showMore && scrollIntoView) {
        if (scrollTarget.current) {
          scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
        }
      }

      if (showMore) {
        setStockHistory([])
        const history = await getStockOrFutureChart(item.Symbol, 90, isStock)
        if (isStock) {
          putSearchedStock(item)
        }
        setStockHistory(history)
        setSelectedTab('Details')
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMore, item.Symbol])

  const handleCompanyClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined, show: boolean) => {
    if (!disabled) {
      setShowMore(show)
    }
  }

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  useEffect(() => {
    if (tabScrollTarget.current) {
      if (selectedTab !== 'Details') {
        tabScrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [selectedTab])

  return (
    <>
      {isLoadingProfile ? (
        <BackdropLoader />
      ) : (
        <>
          <Box key={item.Symbol} py={1}>
            <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -12 }}></Typography>
            <Box>
              {isStock ? (
                <ListHeader text={`${item.Company} (${item.Symbol})`} item={item} onClicked={(e) => handleCompanyClick(e, !showMore)} disabled={disabled} />
              ) : (
                <ListHeader text={`${item.Company}`} item={item} onClicked={(e) => handleCompanyClick(e, !showMore)} disabled={disabled} />
              )}
              <Box key={`${item.Symbol}${item.Price}`}>
                <StockChange item={item} />
              </Box>
              {featuredField && (
                <Box pl={2}>
                  <StockField quote={item} field={featuredField} />
                </Box>
              )}
              {showGroupName && item.GroupName && (
                <Stack pl={2}>
                  <Typography variant='caption' color='primary'>{`Group Name: ${item.GroupName}`}</Typography>
                </Stack>
              )}
            </Box>
            {!showMore && <HorizontalDivider />}
            {showMore && (
              <>
                <Box>
                  <HorizontalDivider />
                </Box>
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
                      <Box display={'flex'} gap={2} alignItems={'center'}>
                        <StockSubscibeIcon userProfile={authProfile} quote={item} />
                      </Box>
                    )}

                    <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />
                    <Typography ref={tabScrollTarget} sx={{ position: 'absolute', mt: -20 }}></Typography>
                    <Box key={item.Symbol}>
                      {selectedTab === 'Details' && <StockDetailsTab quote={item} />}
                      {selectedTab === 'News' && <StockNews quote={item} />}
                      {selectedTab === 'Earnings' && <StockEarnings quote={item} />}
                      {selectedTab === 'Profile' && <CompanyProfile quote={item} />}
                      {selectedTab === 'Dividends' && <StockDividendDetails symbol={item.Symbol} showCompanyName={false} />}
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </>
  )
}

export default StockListItem
