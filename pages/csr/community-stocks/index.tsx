import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CategoryType } from 'lib/backend/api/aws/models/apiGatewayModels'
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
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { mutate } from 'swr'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CommunityStocksRecentLayout from 'components/Organizms/stocks/CommunityStocksRecentLayout'
import Seo from 'components/Organizms/Seo'
import TabList from 'components/Atoms/Buttons/TabList'
import { sortArray } from 'lib/util/collections'
import CommunityStocksWrapper from 'components/Organizms/stocks/CommunityStocksWrapper'
import { useSwrHelper } from 'hooks/useSwrHelper'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import PageHeader from 'components/Atoms/Containers/PageHeader'

type Tab = 'Recent' | 'Winners' | 'Losers'

const Page = () => {
  const [selectedTab, setSelectedTab] = React.useState<Tab>('Recent')

  const searchedStocksKey: CategoryType = 'searched-stocks'
  const mutateKey = `community-stocks`

  const dataFn = async () => {
    const searchedStocksResult = await searchRecords(searchedStocksKey)
    const sorted = sortArray(searchedStocksResult, ['last_modified'], ['desc'])
    const result: StockQuote[] = sorted.map((m) => {
      return JSON.parse(m.data)
    })
    const stockMap = getMapFromArray(result, 'Symbol')
    const latest = await getLatestQuotes(result.map((m) => m.Symbol))
    latest.forEach((item) => {
      stockMap.set(item.Symbol, item)
    })
    return Array.from(stockMap.values())
  }
  const { data: searchedStocks, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const [stockSearchResults, setStockSearchResults] = React.useState<DropdownItem[]>([])
  const [loadingStock, setLoadingStock] = React.useState(false)

  //console.log('searchedStocks: ', searchedStocks)

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
    if (text.length === 0) {
      return
    }
    const symbol = text.split(':')[0]
    setStockSearchResults([])
    setLoadingStock(true)
    setSelectedStock(null)
    const quotes = await getStockQuotes([symbol])
    setLoadingStock(false)
    if (quotes.length > 0) {
      const quote = quotes[0]
      setSelectedStock(quote)
      const newData = [...searchedStocks!].filter((m) => m.Symbol !== quote.Symbol)
      newData.unshift(quote)
      mutate(mutateKey, newData, { revalidate: false })
    }
  }

  const handleAddToList = (quote: StockQuote) => {
    mutate(mutateKey)
  }

  const handleCloseAddQuote = () => {
    setSelectedStock(null)
  }
  const handleRefreshRecent = () => {
    mutate(mutateKey)
  }

  return (
    <>
      {isLoading && (
        <>
          <BackdropLoader />
        </>
      )}
      <Seo pageTitle={`Community Stocks`} />

      <ResponsiveContainer>
        <PageHeader text='Community Stocks' />
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
        {!selectedStock && <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />}

        {loadingStock && <BackdropLoader />}
        {!selectedStock && (
          <>
            {selectedTab === 'Recent' && (
              <Box>
                <ScrollIntoView margin={-20} enabled />
                {searchedStocks && <CommunityStocksRecentLayout data={searchedStocks} onRefresh={handleRefreshRecent} />}
              </Box>
            )}
            {selectedTab === 'Winners' && <CommunityStocksWrapper data={winners} />}
            {selectedTab === 'Losers' && <CommunityStocksWrapper data={losers} />}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
