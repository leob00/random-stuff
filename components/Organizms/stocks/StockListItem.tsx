import { Box, Stack, Typography } from '@mui/material'
import {
  CasinoBlackTransparent,
  CasinoDarkGreenTransparent,
  CasinoDarkRedTransparent,
  CasinoLimeTransparent,
  RedDarkMode,
  VeryLightBlue,
} from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
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
import StockDividendDetails from './dividends/StockDividendDetails'
import StockField from './StockField'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { MarketCategory } from 'lib/backend/api/qln/chartApi'
import HoverEffect from 'components/Molecules/Lists/HoverEffect'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const StockListItem = ({
  item,
  expand = false,
  marketCategory,
  showGroupName = true,
  scrollIntoView = true,
  disabled,
  featuredField,
}: {
  item: StockQuote
  expand?: boolean
  marketCategory: MarketCategory
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

  const { userProfile, isValidating } = useProfileValidator()
  const [showMore, setShowMore] = useState(expand ?? false)
  const [selectedTab, setSelectedTab] = useState('Details')
  const scrollTarget = useRef<HTMLSpanElement | null>(null)
  const tabScrollTarget = useRef<HTMLSpanElement | null>(null)
  const isStock = marketCategory === 'stocks'
  const handleCompanyClick = async () => {
    if (!disabled) {
      setShowMore(!showMore)
    }
  }

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  useEffect(() => {
    const fn = async () => {
      if (showMore) {
        if (isStock) {
          putSearchedStock(item)
        }
        if (scrollIntoView) {
          if (scrollTarget.current) {
            scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
          }
        }
        setSelectedTab('Details')
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMore, item.Symbol])

  useEffect(() => {
    if (tabScrollTarget.current) {
      if (selectedTab !== 'Details') {
        tabScrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [selectedTab])

  return (
    <>
      <Box py={1}>
        <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -12 }}></Typography>
        <FadeIn>
          <Box>
            {marketCategory === 'stocks' ? (
              <ListHeader text={`${item.Company} (${item.Symbol})`} item={item} onClicked={handleCompanyClick} disabled={disabled} elevation={0} />
            ) : (
              <ListHeader text={`${item.Company}`} item={item} onClicked={handleCompanyClick} disabled={disabled} elevation={0} />
            )}
            <Box>
              <StockChange item={item} />
            </Box>
            {featuredField && (
              <Box pl={2}>
                <StockField quote={item} field={featuredField} />
              </Box>
            )}
            {showGroupName && item.GroupName && (
              <Stack pl={2} py={2}>
                <Typography variant='caption' color='primary'>{`Group Name: ${item.GroupName}`}</Typography>
              </Stack>
            )}
          </Box>
        </FadeIn>
        <Box pt={1}>
          <HorizontalDivider />
        </Box>

        {showMore && (
          <>
            <Box minHeight={{ xs: 300, sm: 600 }}>
              <StockChart symbol={item.Symbol} marketCategory={marketCategory} />
            </Box>
            {isStock && (
              <>
                {userProfile && !isValidating && (
                  <Box display={'flex'} gap={2}>
                    <StockSubscibeIcon userProfile={userProfile} quote={item} size='medium' />
                  </Box>
                )}
                <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />
                <Typography ref={tabScrollTarget} sx={{ position: 'absolute', mt: -20 }}></Typography>
                <Box>
                  {selectedTab === 'Details' && <StockDetailsTab quote={item} authProfile={userProfile} />}
                  {selectedTab === 'News' && <StockNews quote={item} profile={userProfile} />}
                  {selectedTab === 'Earnings' && <StockEarnings quote={item} />}
                  {selectedTab === 'Dividends' && <StockDividendDetails symbol={item.Symbol} showCompanyName={false} />}
                  {selectedTab === 'Profile' && <CompanyProfile quote={item} />}
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </>
  )
}
export const getPositiveNegativeColor = (val?: number | null, mode: 'light' | 'dark' = 'light') => {
  let color = mode === 'light' ? CasinoBlackTransparent : VeryLightBlue

  if (!val) {
    return color
  }

  if (val < 0) {
    color = mode === 'light' ? CasinoDarkRedTransparent : RedDarkMode
  } else if (val > 0) {
    color = mode === 'light' ? CasinoDarkGreenTransparent : CasinoLimeTransparent
  }

  return color
}

export const getPositiveNegativeColorReverse = (val?: number | null, mode: 'light' | 'dark' = 'light') => {
  let color = mode === 'light' ? CasinoBlackTransparent : VeryLightBlue

  if (!val) {
    return color
  }

  if (val > 0) {
    color = mode === 'light' ? CasinoDarkRedTransparent : RedDarkMode
  } else if (val < 0) {
    color = mode === 'light' ? CasinoDarkGreenTransparent : CasinoLimeTransparent
  }

  return color
}

export default StockListItem
