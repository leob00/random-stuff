import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CategoryType } from 'lib/backend/api/aws/models/apiGatewayModels'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import { Box } from '@mui/material'
import { getLatestQuotes } from 'lib/backend/api/qln/qlnApi'
import { searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { mutate } from 'swr'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CommunityStocksRecentLayout from 'components/Organizms/stocks/CommunityStocksRecentLayout'
import Seo from 'components/Organizms/Seo'
import TabList from 'components/Atoms/Buttons/TabList'
import { sortArray } from 'lib/util/collections'
import CommunityStocksWrapper from 'components/Organizms/stocks/CommunityStocksWrapper'
import { useSwrHelper } from 'hooks/useSwrHelper'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { useState } from 'react'
import StockSearch from 'components/Atoms/Inputs/StockSearch'
import FullStockDetail from 'components/Organizms/stocks/FullStockDetail'

type Tab = 'Recent' | 'Winners' | 'Losers'
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

const Page = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('Recent')

  const searchedStocksKey: CategoryType = 'searched-stocks'

  const dataFn = async () => {
    const searchedStocksResult = await searchDynamoItemsByCategory(searchedStocksKey)
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
  const { data: searchedStocks, isLoading } = useSwrHelper(searchedStocksKey, dataFn, { revalidateOnFocus: true })

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
    setSelectedTab(tab.title as Tab)
  }
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null)

  const handleSelectQuote = (quote: StockQuote) => {
    setSelectedStock(quote)
  }

  const handleRefreshRecent = () => {
    setSelectedStock(null)
    mutate(searchedStocksKey)
  }
  const handleCloseQuoteDialog = () => {
    if (selectedStock) {
      const newCopy = searchedStocks!.filter((m) => m.Symbol !== selectedStock.Symbol)
      newCopy.unshift(selectedStock)
      mutate(searchedStocksKey, newCopy, { revalidate: false })
    }
    setSelectedStock(null)
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      <Seo pageTitle={`Stocks`} />
      <ResponsiveContainer>
        <PageHeader text='Stocks' />
        {!selectedStock && (
          <Box py={2}>
            <StockSearch onSymbolSelected={handleSelectQuote} clearOnSelect showAdvSearch />
          </Box>
        )}
        {selectedStock && <FullStockDetail item={selectedStock} onClose={handleCloseQuoteDialog} />}
        {!selectedStock && <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />}
        {!selectedStock && (
          <>
            {selectedTab === 'Recent' && (
              <Box>
                {searchedStocks && (
                  <>
                    <CommunityStocksRecentLayout data={searchedStocks} onRefresh={handleRefreshRecent} />
                  </>
                )}
              </Box>
            )}
            {selectedTab === 'Winners' && <CommunityStocksWrapper data={winners} onRefresh={handleRefreshRecent} />}
            {selectedTab === 'Losers' && <CommunityStocksWrapper data={losers} onRefresh={handleRefreshRecent} />}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
