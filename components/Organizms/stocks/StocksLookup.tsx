import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import StocksAutoComplete from 'components/Atoms/Inputs/StocksAutoComplete'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import numeral from 'numeral'
import React from 'react'
import StockListItem from './StockListItem'
import { getSearchAheadTotalCount, searchAheadStocks } from './stockSearcher'

const StocksLookup = ({ onFound }: { onFound: (item: StockQuote) => void }) => {
  const [autocompResults, setAutocompResults] = React.useState<DropdownItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSearched = async (text: string) => {
    const searchResults = searchAheadStocks(text)
    const autoComp: DropdownItem[] = searchResults.map((e) => {
      return {
        text: `${e.Symbol}: ${e.Company}`,
        value: e.Symbol,
      }
    })
    setAutocompResults(autoComp)
  }

  const handleSelectQuote = async (text: string) => {
    setError(null)
    setIsLoading(true)
    const symbol = text.split(':')[0]

    const quotes = await getStockQuotes([symbol])
    if (quotes.length > 0) {
      const quote = quotes[0]
      onFound(quote)
    } else {
      setError(`unable to find symbol: ${symbol}`)
    }
    setIsLoading(false)
  }

  return (
    <>
      <Box>
        {isLoading && <BackdropLoader />}
        <CenterStack>
          <StocksAutoComplete
            placeholder={`search ${numeral(getSearchAheadTotalCount()).format('###,###')} stocks`}
            onChanged={handleSearched}
            searchResults={autocompResults}
            debounceWaitMilliseconds={500}
            onSelected={handleSelectQuote}
          />
        </CenterStack>
      </Box>
    </>
  )
}

export default StocksLookup
