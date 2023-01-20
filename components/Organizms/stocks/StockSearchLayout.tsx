import { Box, List, ListItem, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SearchAutoComplete from 'components/Atoms/Inputs/SearchAutoComplete'
import WarmupBox from 'components/Atoms/WarmupBox'
import { useUserController } from 'hooks/userController'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes, searchStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { getUserStockList, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { cloneDeep } from 'lodash'
import React from 'react'
import StockTable from './StockTable'

interface Model {
  isLoading: boolean
  autoCompleteResults: DropdownItem[]
  searchedStocksMap: Map<string, StockQuote>
  stockListMap: Map<string, StockQuote>
  stockList: StockQuote[]
}

const StockSearchLayout = () => {
  /*  const [searchResults, setSearchResults] = React.useState<DropdownItem[]>([])
  const [searchedStocks, setSearchedStocks] = React.useState(new Map<string, StockQuote>([]))
  const [stockListMap, setStockListMap] = React.useState(new Map<string, StockQuote>([]))
  const [stockList, setStockList] = React.useState<StockQuote[]>([])
 */

  const userController = useUserController()

  const defaultModel: Model = {
    isLoading: true,
    autoCompleteResults: [],
    searchedStocksMap: new Map<string, StockQuote>([]),
    stockListMap: new Map<string, StockQuote>([]),
    stockList: [],
  }

  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const getStockSearchMap = (list: StockQuote[]) => {
    const map = cloneDeep(model.searchedStocksMap)
    list.forEach((item, index) => {
      map.set(item.Symbol, item)
    })
    return map
  }

  const handleSearched = async (text: string) => {
    if (text.length > 0) {
      const result = await searchStockQuotes(text)
      const autoComp: DropdownItem[] = result.map((e) => {
        return {
          text: `${e.Symbol}: ${e.Company}`,
          value: e.Symbol,
        }
      })
      const map = getStockSearchMap(result)
      setModel({ ...model, searchedStocksMap: map, autoCompleteResults: autoComp })
    }
  }

  const handleSearchSelected = (text: string) => {
    const symbol = text.split(':')[0]
    const quote = model.searchedStocksMap.get(symbol)
    const stockListMap = cloneDeep(model.stockListMap)
    if (quote) {
      //console.log(`found quote in ${searchedStocks.size} stocks : ${JSON.stringify(quote)}`)
      stockListMap.set(quote.Symbol, quote)
      let list: StockQuote[] = []
      stockListMap.forEach((val) => {
        list.push(val)
      })
      if (userController.username) {
        putUserStockList(userController.username, list)
      }
      setModel({ ...model, stockListMap: stockListMap, stockList: list })
    }
  }
  const reloadData = async () => {
    setModel({ ...model, isLoading: true })
    if (userController.username) {
      const result = await getUserStockList(userController.username)
      const map = getStockSearchMap(result)
      let quotes: StockQuote[] = []
      if (result.length > 0) {
        setModel({ ...model, isLoading: true })
        quotes = await getStockQuotes(result.map((o) => o.Symbol))

        putUserStockList(userController.username, quotes)
      }
      setModel({ ...model, stockListMap: map, searchedStocksMap: map, stockList: quotes.length > 0 ? quotes : result, isLoading: false })
    } else {
      setModel({ ...model, isLoading: false })
    }
  }

  React.useEffect(() => {
    const fn = async () => {
      await reloadData()
    }
    fn()
  }, [])

  return (
    <>
      <Box py={2}>
        <CenterStack>
          <SearchAutoComplete
            placeholder={'search stocks'}
            onChanged={handleSearched}
            searchResults={model.autoCompleteResults}
            debounceWaitMilliseconds={500}
            onSelected={handleSearchSelected}
          />
        </CenterStack>
      </Box>
      <Box py={2}>
        {model.isLoading ? (
          <WarmupBox />
        ) : (
          <CenterStack>
            <StockTable stockList={model.stockList} />
          </CenterStack>
        )}
      </Box>
    </>
  )
}

export default StockSearchLayout
