import { getSearchAheadTotalCount, searchAheadStocks } from 'components/Organizms/stocks/stockSearcher'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import numeral from 'numeral'
import CenterStack from '../CenterStack'
import StocksAutoComplete from './StocksAutoComplete'
import { useState } from 'react'
import { Box } from '@mui/material'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import ComponentLoader from '../Loaders/ComponentLoader'

const StockSearch = ({
  onSymbolSelected,
  clearOnSelect = true,
  errorMessage,
  showAdvSearch = false,
  width,
}: {
  onSymbolSelected: (quote: StockQuote) => void
  clearOnSelect?: boolean
  errorMessage?: string
  showAdvSearch?: boolean
  width?: number
}) => {
  const [results, setResults] = useState<DropdownItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchAheadCount = `${numeral(getSearchAheadTotalCount()).format('###,###')}`

  const handleSelectQuote = async (text: string) => {
    if (text.length === 0) {
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
    <Box>
      <CenterStack>
        <StocksAutoComplete
          placeholder={`search ${searchAheadCount} quotes`}
          onChanged={handleSearched}
          searchResults={results}
          debounceWaitMilliseconds={500}
          onSelected={handleSelectQuote}
          clearOnSelect={clearOnSelect}
          errorMessage={errorMessage}
          freesolo
          width={width}
        />
      </CenterStack>
      {isLoading && <ComponentLoader />}
      {showAdvSearch && (
        <Box maxWidth={{ xs: '98%', sm: '98%', md: '77%', lg: '69%' }}>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <SiteLink text={'advanced search'} href='/market/stocks/advanced-search' />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default StockSearch
