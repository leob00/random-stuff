import { Box, List, ListItem, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import InternalLinkButton from 'components/Atoms/Buttons/InternalLinkButton'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import CenterStack from 'components/Atoms/CenterStack'
import SearchAutoComplete from 'components/Atoms/Inputs/SearchAutoComplete'
import WarmupBox from 'components/Atoms/WarmupBox'
import DraggableList from 'components/Molecules/Lists/DraggableList'
import { useUserController } from 'hooks/userController'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes, searchStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserStockList, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { cloneDeep } from 'lodash'
import React from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import StockTable from './StockTable'

interface Model {
  username: string | null
  isLoading: boolean
  autoCompleteResults: DropdownItem[]
  searchedStocksMap: Map<string, StockQuote>
  stockListMap: Map<string, StockQuote>
  stockList: StockQuote[]
  editList: boolean
}

const StockSearchLayout = () => {
  /*  const [searchResults, setSearchResults] = React.useState<DropdownItem[]>([])
  const [searchedStocks, setSearchedStocks] = React.useState(new Map<string, StockQuote>([]))
  const [stockListMap, setStockListMap] = React.useState(new Map<string, StockQuote>([]))
  const [stockList, setStockList] = React.useState<StockQuote[]>([])
 */
  //const username = useUserController().username
  const defaultModel: Model = {
    username: null,
    isLoading: true,
    autoCompleteResults: [],
    searchedStocksMap: new Map<string, StockQuote>([]),
    stockListMap: new Map<string, StockQuote>([]),
    stockList: [],
    editList: false,
  }

  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const getStockSearchMap = (list: StockQuote[]) => {
    const map = cloneDeep(model.searchedStocksMap)
    list.forEach((item, index) => {
      map.set(item.Symbol, item)
    })
    return map
  }
  const getStockListMap = (list: StockQuote[]) => {
    const map = cloneDeep(model.stockListMap)
    list.forEach((item) => {
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

  const handleAddQuote = (text: string) => {
    const symbol = text.split(':')[0]
    const quote = model.searchedStocksMap.get(symbol)
    const stockList = model.stockList
    let stockListMap = getStockListMap(stockList)
    if (quote) {
      stockList.unshift(quote)
      stockListMap.set(quote.Symbol, quote)
      if (model.username) {
        putUserStockList(model.username, stockList)
      }
      setModel({ ...model, stockListMap: stockListMap, stockList: stockList, autoCompleteResults: [] })
    }
  }
  const reloadData = async () => {
    const user = await getUserCSR()
    const username = user ? user.email : null
    let stockList = model.stockList
    let map = model.stockListMap
    let quotes: StockQuote[] = []

    if (username) {
      stockList = await getUserStockList(username)
      map = getStockSearchMap(stockList)
      if (stockList.length > 0) {
        quotes = await getStockQuotes(stockList.map((o) => o.Symbol))
        putUserStockList(username, quotes)
      }
    } else {
    }
    setModel({ ...model, username: username, stockListMap: map, searchedStocksMap: map, stockList: quotes.length > 0 ? quotes : stockList, isLoading: false })
    //console.log('loaded stock list: ', stockList.length)
  }

  const handleRemoveStock = (symbol: string) => {
    const stockListMap = cloneDeep(model.stockListMap)
    stockListMap.delete(symbol)
    let list: StockQuote[] = []
    stockListMap.forEach((val) => {
      list.push(val)
    })
    if (model.username) {
      putUserStockList(model.username, list)
    }
    setModel({ ...model, stockListMap: stockListMap, stockList: list })
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return
    const items = model.stockList
    const [removed] = items.splice(source.index, 1)
    items.splice(destination.index, 0, removed)
    setModel({ ...model, stockList: items })
    if (model.username) {
      putUserStockList(model.username, items)
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
            onSelected={handleAddQuote}
          />
        </CenterStack>
      </Box>
      <Box py={2}>
        {model.isLoading ? (
          <WarmupBox text='loading stock list...' />
        ) : (
          <Box>
            {model.editList ? (
              <ResponsiveContainer>
                <Stack py={2} alignItems={'flex-end'} pr={2}>
                  <LinkButton
                    onClick={() => {
                      setModel({ ...model, editList: false })
                    }}
                  >
                    done
                  </LinkButton>
                </Stack>
                <DraggableList items={model.stockList} onDragEnd={onDragEnd} />
              </ResponsiveContainer>
            ) : (
              <>
                <ResponsiveContainer>
                  <Stack py={2} alignItems={'flex-end'} pr={2}>
                    <LinkButton
                      onClick={() => {
                        setModel({ ...model, editList: true })
                      }}
                    >
                      reorder
                    </LinkButton>
                  </Stack>
                  <StockTable stockList={model.stockList} onRemoveItem={handleRemoveStock} />
                </ResponsiveContainer>
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  )
}

export default StockSearchLayout
