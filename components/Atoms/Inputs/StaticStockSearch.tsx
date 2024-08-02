import { getSearchAheadTotalCount, searchAheadStocks } from 'components/Organizms/stocks/stockSearcher'
import { DropdownItem } from 'lib/models/dropdown'
import numeral from 'numeral'
import React from 'react'
import CenterStack from '../CenterStack'
import StaticAutoComplete from './StaticAutoComplete'

const StaticStockSearch = ({ onSymbolSelected, errorMessage }: { onSymbolSelected: (item: DropdownItem) => void; errorMessage?: string }) => {
  const [results, setResults] = React.useState<DropdownItem[]>([])

  const handleSelectQuote = async (item: DropdownItem) => {
    onSymbolSelected(item)
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
      <StaticAutoComplete
        placeholder={`search ${numeral(getSearchAheadTotalCount()).format('###,###')} stocks`}
        onSelected={handleSelectQuote}
        options={results}
        onChanged={handleSearched}
        errorMessage={errorMessage}
      />
    </CenterStack>
  )
}

export default StaticStockSearch
