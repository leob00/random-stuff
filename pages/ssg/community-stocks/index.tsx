import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CategoryType } from 'lib/backend/api/aws/apiGateway'
import { orderBy } from 'lodash'
import CommunityStocksLayout from 'components/Organizms/stocks/CommunityStocksLayout'
import BackButton from 'components/Atoms/Buttons/BackButton'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import React from 'react'
import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import StocksAutoComplete from 'components/Atoms/Inputs/StocksAutoComplete'
import { getSearchAheadTotalCount, searchAheadStocks } from 'components/Organizms/stocks/stockSearcher'
import numeral from 'numeral'
import { DropdownItem } from 'lib/models/dropdown'
import { getLatestQuotes, getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import AddQuote from 'components/Organizms/stocks/AddQuote'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
import useSWR, { mutate } from 'swr'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import CommunityStocksRecentLayout from 'components/Organizms/stocks/CommunityStocksRecentLayout'
import Seo from 'components/Organizms/Seo'
import TabList from 'components/Atoms/Buttons/TabList'

type Tab = 'Recent' | 'Winners' | 'Losers'
const Page = () => {
  const [selectedTab, setSelectedTab] = React.useState<Tab>('Recent')

  const searchedStocksKey: CategoryType = 'searched-stocks'
  const recentlySearchedEnc = encodeURIComponent(weakEncrypt(`${searchedStocksKey}`))
  const recentlySearchedMutateKey = ['/api/searchRandomStuff', recentlySearchedEnc]

  const fetchRecentlySearched = async (url: string, enc: string) => {
    const searchedStocksResult = await searchRecords(searchedStocksKey)
    const searchedStocks: StockQuote[] = []
    orderBy(searchedStocksResult, ['last_modified'], ['desc']).forEach((item) => {
      searchedStocks.push(JSON.parse(item.data))
    })
    const latest = await getLatestQuotes(searchedStocks.map((m) => m.Symbol))
    return latest
  }

  const { data: searchedStocks, isLoading, isValidating } = useSWR(recentlySearchedMutateKey, ([url, enc]) => fetchRecentlySearched(url, enc))
  const [stockSearchResults, setStockSearchResults] = React.useState<DropdownItem[]>([])
  const [loadingStock, setLoadingStock] = React.useState(false)

  const tabs: TabInfo[] = [
    {
      selected: true,
      title: 'Recent',
    },
    {
      title: 'Winners',
    },
    {
      title: 'Losers',
    },
  ]

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title as Tab)
  }
  const [selectedStock, setSelectedStock] = React.useState<StockQuote | null>(null)

  const handleSearched = async (text: string) => {
    const searchResults = searchAheadStocks(text)
    const autoComp: DropdownItem[] = searchResults.map((e) => {
      return {
        text: `${e.Symbol}: ${e.Company}`,
        value: e.Symbol,
      }
    })
    setStockSearchResults(autoComp)
  }

  const handleSelectQuote = async (text: string) => {
    const symbol = text.split(':')[0]
    setStockSearchResults([])
    setLoadingStock(true)
    setSelectedStock(null)
    const quotes = await getStockQuotes([symbol])
    setLoadingStock(false)
    if (quotes.length > 0) {
      const quote = quotes[0]
      setSelectedStock(quote)
    }
  }

  const handleAddToList = () => {}

  const handleCloseAddQuote = () => {
    setSelectedStock(null)
    mutate(recentlySearchedMutateKey)
  }

  return (
    <>
      <Seo pageTitle={`Community Stocks`} />

      <ResponsiveContainer>
        <BackButton />
        <CenteredHeader title='Community Stocks' />

        <Box py={2}>
          <CenterStack>
            <StocksAutoComplete
              placeholder={`search ${numeral(getSearchAheadTotalCount()).format('###,###')} stocks`}
              onChanged={handleSearched}
              searchResults={stockSearchResults}
              debounceWaitMilliseconds={500}
              onSelected={handleSelectQuote}
            />
          </CenterStack>
        </Box>
        {selectedStock && (
          <AddQuote
            stockListMap={getMapFromArray(searchedStocks!, 'Symbol')}
            quote={selectedStock}
            handleAddToList={handleAddToList}
            handleCloseAddQuote={handleCloseAddQuote}
            scrollIntoView
            showAddToListButton={false}
          />
        )}
        {!selectedStock && <TabList tabs={tabs} onSetTab={handleSelectTab} />}
        {isLoading && (
          <>
            <BackdropLoader />
            <LargeGridSkeleton />
          </>
        )}
        {loadingStock && <BackdropLoader />}
        {!selectedStock && (
          <>
            {searchedStocks && (
              <>
                {selectedTab === 'Recent' && <CommunityStocksRecentLayout data={searchedStocks} />}
                {selectedTab === 'Winners' && (
                  <CommunityStocksLayout
                    data={searchedStocks.filter((m) => m.ChangePercent >= 0)}
                    defaultSort={[{ key: 'ChangePercent', direction: 'desc' }]}
                  />
                )}
                {selectedTab === 'Losers' && (
                  <CommunityStocksLayout data={searchedStocks.filter((m) => m.ChangePercent < 0)} defaultSort={[{ key: 'ChangePercent', direction: 'asc' }]} />
                )}
              </>
            )}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
