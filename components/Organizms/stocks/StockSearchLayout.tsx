import { Close } from '@mui/icons-material'
import { Box, Button, Stack } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchAutoComplete from 'components/Atoms/Inputs/SearchAutoComplete'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import StockListMenu from 'components/Molecules/Menus/StockListMenu'
import DraggableList from 'components/Organizms/stocks/DraggableList'
import { useUserController } from 'hooks/userController'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { searchStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { getUserStockList, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { cloneDeep } from 'lodash'
import React from 'react'
import { DropResult } from 'react-beautiful-dnd'
import AddQuote from './AddQuote'
import StockTable from './StockTable'

interface Model {
  username: string | null
  isLoading: boolean
  autoCompleteResults: DropdownItem[]
  searchedStocksMap: Map<string, StockQuote>
  stockListMap: Map<string, StockQuote>
  stockList: StockQuote[]
  editList: boolean
  quoteToAdd?: StockQuote
}

const StockSearchLayout = () => {
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
  const userController = useUserController()

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
      setModel({ ...model, searchedStocksMap: searchedStocksMap, autoCompleteResults: autoComp, quoteToAdd: undefined })
    }
  }

  const handleSelectQuote = (text: string) => {
    const symbol = text.split(':')[0]
    const quote = cloneDeep(model.searchedStocksMap.get(symbol))
    setModel({ ...model, isLoading: true })
    if (quote) {
      setModel({ ...model, quoteToAdd: quote, autoCompleteResults: [] })
    }
  }
  const reloadData = async () => {
    const ticket = userController.ticket
    setModel({ ...model, isLoading: true })

    let stockList = [...model.stockList]
    let map = model.stockListMap

    if (ticket) {
      stockList = await getUserStockList(ticket.email)
      map = getMapFromArray(stockList, 'Symbol')
      setModel({ ...model, username: ticket.email, stockListMap: map, stockList: stockList, isLoading: false })
    } else {
      setTimeout(() => {
        setModel({ ...model, username: null, stockListMap: map, stockList: stockList, isLoading: false })
      }, 1000)
    }
  }

  const handleRemoveQuote = (symbol: string) => {
    const list = model.stockList.filter((m) => m.Symbol !== symbol)
    const map = getMapFromArray(list, 'Symbol')
    if (model.username) {
      putUserStockList(model.username, list)
    }
    setModel({ ...model, stockListMap: map, stockList: list })
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return
    }
    const items = model.stockList
    const [removed] = items.splice(source.index, 1)
    items.splice(destination.index, 0, removed)
    setModel({ ...model, stockList: items })
    if (model.username) {
      putUserStockList(model.username, items)
    }
  }
  const handleAddToList = async () => {
    const quote = cloneDeep(model.quoteToAdd!)
    let stockList = cloneDeep(model.stockList)
    let stockListMap = getMapFromArray(stockList, 'Symbol')
    if (!stockListMap.has(quote.Symbol)) {
      stockListMap.set(quote.Symbol, quote)
      const newList: StockQuote[] = []
      stockListMap.forEach((val) => {
        if (val.Symbol !== quote.Symbol) {
          newList.push(val)
        }
      })
      newList.unshift(quote)
      if (model.username) {
        putUserStockList(model.username, newList)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })

      setModel({ ...model, stockListMap: stockListMap, stockList: newList, autoCompleteResults: [], quoteToAdd: undefined, isLoading: false })
    } else {
      setModel({ ...model, quoteToAdd: undefined, isLoading: false })
    }
  }
  const handleCloseAddQuote = () => {
    setModel({ ...model, quoteToAdd: undefined, isLoading: false })
  }

  React.useEffect(() => {
    const fn = async () => {
      //console.log('ticket: ', userController.ticket)
      await reloadData()
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

  return (
    <>
      <Box py={2}>
        <CenterStack>
          <SearchAutoComplete
            placeholder={'search stocks'}
            onChanged={handleSearched}
            searchResults={model.autoCompleteResults}
            debounceWaitMilliseconds={500}
            onSelected={handleSelectQuote}
          />
        </CenterStack>
      </Box>
      {model.quoteToAdd ? (
        <AddQuote quote={model.quoteToAdd} handleAddToList={handleAddToList} handleCloseAddQuote={handleCloseAddQuote} />
      ) : (
        <Box>
          {model.isLoading ? (
            <>
              <WarmupBox />
              <LargeGridSkeleton />
            </>
          ) : (
            <Box py={2}>
              {model.editList && model.stockList.length > 0 ? (
                <>
                  <Stack py={2} alignItems={'flex-end'} pr={2}>
                    <Button
                      size='small'
                      color='secondary'
                      onClick={() => {
                        setModel({ ...model, editList: false })
                      }}
                    >
                      <Close fontSize='small' color='secondary' />
                    </Button>
                  </Stack>
                  <HorizontalDivider />
                  <DraggableList items={model.stockList} onDragEnd={onDragEnd} onRemoveItem={handleRemoveQuote} />
                </>
              ) : (
                <>
                  {model.stockList.length > 0 && (
                    <Stack pt={1} alignItems={'flex-end'}>
                      <StockListMenu
                        onEdit={() => {
                          setModel({ ...model, editList: true })
                        }}
                        onRefresh={reloadData}
                      />
                    </Stack>
                  )}
                  <StockTable stockList={model.stockList} />
                </>
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default StockSearchLayout
