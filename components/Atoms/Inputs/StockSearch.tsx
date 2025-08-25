import { getSearchAheadTotalCount, searchAheadStocks } from 'components/Organizms/stocks/stockSearcher'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import numeral from 'numeral'
import CenterStack from '../CenterStack'
import BackdropLoader from '../Loaders/BackdropLoader'
import StocksAutoComplete from './StocksAutoComplete'
import { useState } from 'react'
import { Box } from '@mui/material'
import LinkButton2 from '../Buttons/LinkButton2'
import LinkButton from '../Buttons/LinkButton'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'

const StockSearch = ({
  onSymbolSelected,
  clearOnSelect = true,
  errorMessage,
}: {
  onSymbolSelected: (quote: StockQuote) => void
  clearOnSelect?: boolean
  errorMessage?: string
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
        {isLoading && <BackdropLoader />}
        <StocksAutoComplete
          placeholder={`search ${searchAheadCount} stocks`}
          onChanged={handleSearched}
          searchResults={results}
          debounceWaitMilliseconds={500}
          onSelected={handleSelectQuote}
          clearOnSelect={clearOnSelect}
          errorMessage={errorMessage}
          freesolo
        />
      </CenterStack>
      <Box maxWidth={{ xs: '100%', sm: '86%', md: '79%', lg: '75%' }}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <SiteLink text={'advanced search'} href='/csr/stocks/advanced-search' />
        </Box>
      </Box>
    </Box>
  )
}

export default StockSearch
