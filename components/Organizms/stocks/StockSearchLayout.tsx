import { Close } from '@mui/icons-material'
import { Box, Button, Stack } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchAutoComplete from 'components/Atoms/Inputs/SearchAutoComplete'
import PageWithGridSkeleton from 'components/Atoms/Skeletons/PageWithGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import StockListMenu from 'components/Molecules/Menus/StockListMenu'
import DraggableList from 'components/Organizms/stocks/DraggableList'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes, searchStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserStockList, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { cloneDeep } from 'lodash'
import React from 'react'
import { DropResult } from 'react-beautiful-dnd'
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

  /* const reRender = React.useMemo(() => {
    console.log('memo: stock list count changed: ', model.stockList.length)
  }, [model.stockList.length])
 */
  /* const getStockSearchMap = (list: StockQuote[]) => {
    const map = cloneDeep(model.searchedStocksMap)
    list.forEach((item, index) => {
      map.set(item.Symbol, item)
    })
    return map
  } */
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
      const searchedStocksMap = new Map<string, StockQuote>([])
      result.forEach((item, index) => {
        searchedStocksMap.set(item.Symbol, item)
      })
      setModel({ ...model, searchedStocksMap: searchedStocksMap, autoCompleteResults: autoComp })
    }
  }

  const handleAddQuote = (text: string) => {
    const symbol = text.split(':')[0]
    const quote = cloneDeep(model.searchedStocksMap.get(symbol))
    const stockList = cloneDeep(model.stockList)
    let stockListMap = getStockListMap(stockList)
    setModel({ ...model, isLoading: true })

    if (quote) {
      stockList.unshift(quote)
      stockListMap.set(quote.Symbol, quote)
      if (model.username) {
        putUserStockList(model.username, stockList)
      }
      setModel({ ...model, stockListMap: stockListMap, stockList: stockList, autoCompleteResults: [] })
    } else {
      setModel({ ...model, isLoading: false })
    }
  }
  const reloadData = async () => {
    const user = await getUserCSR()
    if (user) {
      setModel({ ...model, isLoading: true })
    }
    const username = user ? user.email : null
    let stockList = model.stockList
    let map = model.stockListMap
    let quotes: StockQuote[] = []

    if (username) {
      stockList = await getUserStockList(username)
      //map = getStockSearchMap(stockList)
      if (stockList.length > 0) {
        quotes = await getStockQuotes(stockList.map((o) => o.Symbol))
        putUserStockList(username, quotes)
      }
    } else {
    }
    setModel({ ...model, username: username, stockListMap: map, stockList: quotes.length > 0 ? quotes : stockList, isLoading: false })
    //console.log('loaded stock list: ', stockList.length)
  }

  const handleRemoveQuote = (symbol: string) => {
    let stockListMap = cloneDeep(model.stockListMap)
    stockListMap.delete(symbol)
    const list: StockQuote[] = []
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
          <>
            <ResponsiveContainer>
              <WarmupBox text='loading stock list...' />
              <PageWithGridSkeleton />
            </ResponsiveContainer>
          </>
        ) : (
          <Box>
            {model.editList ? (
              <ResponsiveContainer>
                <Stack py={2} alignItems={'flex-end'} pr={2}>
                  <Button
                    size='small'
                    color='secondary'
                    onClick={() => {
                      setModel({ ...model, editList: false })
                    }}
                  >
                    <Close fontSize='small' />
                  </Button>
                </Stack>
                <HorizontalDivider />
                <DraggableList items={model.stockList} onDragEnd={onDragEnd} onRemoveItem={handleRemoveQuote} />
              </ResponsiveContainer>
            ) : (
              <>
                <ResponsiveContainer>
                  {model.stockList.length > 0 && (
                    <>
                      <Stack py={2} alignItems={'flex-end'} pr={2}>
                        <StockListMenu
                          onEdit={() => {
                            setModel({ ...model, editList: true })
                          }}
                          onRefresh={reloadData}
                        />
                      </Stack>
                    </>
                  )}
                  <StockTable stockList={model.stockList} onRemoveItem={handleRemoveQuote} />
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
