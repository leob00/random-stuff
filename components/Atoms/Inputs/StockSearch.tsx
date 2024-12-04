import { getSearchAheadTotalCount, searchAheadStocks } from 'components/Organizms/stocks/stockSearcher'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import numeral from 'numeral'
import React from 'react'
import CenterStack from '../CenterStack'
import BackdropLoader from '../Loaders/BackdropLoader'
import StocksAutoComplete from './StocksAutoComplete'

const StockSearch = ({
  onSymbolSelected,
  clearOnSelect = true,
  errorMessage,
}: {
  onSymbolSelected: (quote: StockQuote) => void
  clearOnSelect?: boolean
  errorMessage?: string
}) => {
  const [results, setResults] = React.useState<DropdownItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSelectQuote = async (text: string) => {
    if (text.length === 0) {
      onSymbolSelected({
        Symbol: '',
        Company: '',
        Price: 0,
        Change: 0,
        ChangePercent: 0,
        TradeDate: '',
        AnnualDividendYield: null,
      })
      return
    }
    const symbol = text.split(':')[0]
    setIsLoading(true)
    const quotes = await getStockQuotes([symbol])
    if (quotes.length > 0) {
      const quote = quotes[0]
      onSymbolSelected(quote)
    }
    setIsLoading(false)
  }
  const handleSearched = (text: string) => {
    if (text.length === 0) {
      setResults([])
      return
    }
    const searchResults = searchAheadStocks(text)
    const autoComp: DropdownItem[] = searchResults.map((e) => {
      return {
        text: `${e.Symbol}: ${e.Company}`,
        value: e.Symbol,
      }
    })
    setResults(autoComp)
  }
  return (
    <CenterStack>
      {isLoading && <BackdropLoader />}
      <StocksAutoComplete
        placeholder={`search ${numeral(getSearchAheadTotalCount()).format('###,###')} stocks`}
        onChanged={handleSearched}
        searchResults={results}
        debounceWaitMilliseconds={500}
        onSelected={handleSelectQuote}
        clearOnSelect={clearOnSelect}
        errorMessage={errorMessage}
      />
    </CenterStack>
  )
}

export default StockSearch
