import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CategoryType } from 'lib/backend/api/aws/models/apiGatewayModels'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import { Box } from '@mui/material'
import { getLatestQuotes } from 'lib/backend/api/qln/qlnApi'
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
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
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'

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
  const mutateKey = `searched-stocks`

  const dataFn = async () => {
    const searchedStocksResult = await searchRecords(searchedStocksKey)
    const sorted = sortArray(searchedStocksResult, ['last_modified'], ['desc'])
    const result: StockQuote[] = sorted.map((m) => {
      return JSON.parse(m.data)
    })
    const stockMap = new Map<string, StockQuote>()
    const latest = await getLatestQuotes(result.map((m) => m.Symbol))
    latest.forEach((item) => {
      stockMap.set(item.Symbol, item)
    })
    return Array.from(stockMap.values())
  }
  const { data: searchedStocks, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

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
    mutate(mutateKey)
  }
  const handleCloseQuoteDialog = () => {
    if (selectedStock) {
      const newCopy = searchedStocks!.filter((m) => m.Symbol !== selectedStock.Symbol)
      newCopy.unshift(selectedStock)
      mutate(mutateKey, newCopy, { revalidate: false })
    }
    setSelectedStock(null)
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      <Seo pageTitle={`Community Stocks`} />
      <ResponsiveContainer>
        <PageHeader text='Community Stocks' />
        <Box py={2}>
          <StockSearch onSymbolSelected={handleSelectQuote} clearOnSelect />
        </Box>
        <ScrollIntoView margin={0} enabled />
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
