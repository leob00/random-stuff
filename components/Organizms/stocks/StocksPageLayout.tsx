'use client'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CategoryType, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import { Box } from '@mui/material'
import { getLatestQuotes } from 'lib/backend/api/qln/qlnApi'
import { searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { mutate } from 'swr'
import CommunityStocksRecentLayout from 'components/Organizms/stocks/CommunityStocksRecentLayout'
import TabList from 'components/Atoms/Buttons/TabList'
import { sortArray } from 'lib/util/collections'
import CommunityStocksWrapper from 'components/Organizms/stocks/CommunityStocksWrapper'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useState } from 'react'
import StockSearch from 'components/Atoms/Inputs/StockSearch'
import FullStockDetail from 'components/Organizms/stocks/FullStockDetail'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import TopMoversSummary from './summary/stocks/TopMoversSummary'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import VolumeLeadersSummary from './summary/stocks/VolumeLeadersSummary'

const tabs: TabInfo[] = [
  {
    index: 0,
    selected: true,
    title: 'Recent',
  },
  {
    index: 1,
    title: 'Winners',
  },
  {
    index: 2,
    title: 'Losers',
  },
  {
    index: 3,
    title: 'Top Movers',
  },
]
const searchedStocksKey: CategoryType = 'searched-stocks'

const StocksPageLayout = ({ userProfile }: { userProfile: UserProfile | null }) => {
  const [selectedTab, setSelectedTab] = useState<TabInfo>(tabs[0])
  const mutakeKey = userProfile ? `searched-stocks-user[${userProfile.username}]` : searchedStocksKey
  const dataFn = async () => {
    const searchedStocksResult = await searchDynamoItemsByCategory(mutakeKey)
    const sorted = sortArray(searchedStocksResult, ['last_modified'], ['desc'])
    const result: StockQuote[] = sorted.map((m) => {
      return JSON.parse(m.data)
    })
    const stockMap = new Map<string, StockQuote>()
    const latest = await getLatestQuotes(result.map((m) => m.Symbol))
    result.forEach((item) => {
      const found = latest.find((m) => m.Symbol === item.Symbol)
      if (found) {
        stockMap.set(item.Symbol, found)
      } else {
        stockMap.set(item.Symbol, item)
      }
    })
    return Array.from(stockMap.values())
  }
  const { data: searchedStocks, isLoading } = useSwrHelper(mutakeKey, dataFn, { revalidateOnFocus: false })

  const winners: StockQuote[] = searchedStocks
    ? sortArray(
        searchedStocks.filter((m) => m.ChangePercent >= 0),
        ['ChangePercent'],
        ['desc'],
      )
    : []
  const losers: StockQuote[] = searchedStocks
    ? sortArray(
        searchedStocks.filter((m) => m.ChangePercent < 0),
        ['ChangePercent'],
        ['asc'],
      )
    : []

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab)
  }
  const [searchedQuote, setSearchedQuote] = useState<StockQuote | null>(null)

  const handleSelectQuote = (quote: StockQuote) => {
    setSearchedQuote(quote)
  }

  const handleRefreshRecent = () => {
    setSearchedQuote(null)
    mutate(mutakeKey)
  }
  const handleCloseQuoteDialog = () => {
    if (searchedQuote) {
      const newCopy = searchedStocks!.filter((m) => m.Symbol !== searchedQuote.Symbol)
      newCopy.unshift(searchedQuote)
      mutate(mutakeKey, newCopy, { revalidate: false })
    }
    setSearchedQuote(null)
  }

  return (
    <>
      {!searchedQuote && (
        <Box py={2}>
          <StockSearch onSymbolSelected={handleSelectQuote} clearOnSelect showAdvSearch />
        </Box>
      )}
      {isLoading && <ComponentLoader />}
      {searchedQuote && <FullStockDetail item={searchedQuote} onClose={handleCloseQuoteDialog} />}
      {!searchedQuote && <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={selectedTab.index ?? 0} />}
      {!searchedQuote && (
        <>
          {/* <ScrollIntoView enabled={viewPortSize === 'sm'} margin={-13} /> */}
          {selectedTab.index === 0 && <Box>{searchedStocks && <CommunityStocksRecentLayout data={searchedStocks} onRefresh={handleRefreshRecent} />}</Box>}
          {selectedTab.index === 1 && <CommunityStocksWrapper data={winners} onRefresh={handleRefreshRecent} />}
          {selectedTab.index === 2 && <CommunityStocksWrapper data={losers} onRefresh={handleRefreshRecent} />}
          {selectedTab.index === 3 && (
            <Box minHeight={600}>
              <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={{ xs: 'center', md: 'unset' }} pt={4}>
                <Box>
                  <BorderedBox>
                    {' '}
                    <TopMoversSummary userProfile={userProfile} showCompanyName />
                  </BorderedBox>
                </Box>
                <Box>
                  <BorderedBox>
                    {' '}
                    <VolumeLeadersSummary userProfile={userProfile} showCompanyName />
                  </BorderedBox>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default StocksPageLayout
