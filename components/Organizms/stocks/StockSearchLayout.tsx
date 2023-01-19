import { Autocomplete, Box, TextField } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import SearchAutoComplete from 'components/Atoms/Inputs/SearchAutoComplete'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import { getStockQuotes, StockQuote } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import { cloneDeep } from 'lodash'
import React from 'react'

const StockSearchLayout = () => {
  const stockSearchMap = new Map<string, { quote: StockQuote }>([])
  const [searchResults, setSearchResults] = React.useState<DropdownItem[]>([])
  const [searchedStocks, setSearchedStocks] = React.useState(stockSearchMap)

  const handleSearched = async (text: string) => {
    if (text.length > 0) {
      const result = await getStockQuotes(text)
      //console.log(JSON.stringify(result))
      const autoComp: DropdownItem[] = result.map((e) => {
        return {
          text: `${e.Symbol}: ${e.Company}`,
          value: e.Symbol,
        }
      })
      setSearchResults(autoComp)
      const map = cloneDeep(searchedStocks)
      result.forEach((item, index) => {
        map.set(item.Symbol, { quote: item })
      })
      setSearchedStocks(map)
    }
  }

  const handleSearchSelected = (text: string) => {
    const symbol = text.split(':')[0]
    const quote = searchedStocks.get(symbol)
    if (quote) {
      console.log(`found quote in ${searchedStocks.size} stocks : ${JSON.stringify(quote)}`)
    }
  }

  return (
    <Box py={2}>
      <CenterStack>
        <SearchAutoComplete
          placeholder={'search stocks'}
          onChanged={handleSearched}
          searchResults={searchResults}
          debounceWaitMilliseconds={500}
          onSelected={handleSearchSelected}
        />
      </CenterStack>
    </Box>
  )
}

export default StockSearchLayout
