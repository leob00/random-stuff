import { Close } from '@mui/icons-material'
import { Box, Button, Stack } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchAutoComplete from 'components/Atoms/Inputs/SearchAutoComplete'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import StockListMenu from 'components/Molecules/Menus/StockListMenu'
import DraggableList from 'components/Organizms/stocks/DraggableList'
import { useUserController } from 'hooks/userController'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { searchStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { getUserStockList, putUserProfile, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { cloneDeep } from 'lodash'
import React from 'react'
import { DropResult } from 'react-beautiful-dnd'
import AddQuote from './AddQuote'
import EditList from './EditList'
import FlatListMenu from './FlatListMenu'
import GroupedListMenu from './GroupedListMenu'
import GroupedStocksLayout from './GroupedStocksLayout'
import StockTable from './StockTable'

interface Model {
  username?: string | null
  isLoading: boolean
  autoCompleteResults: DropdownItem[]
  searchedStocksMap: Map<string, StockQuote>
  stockListMap: Map<string, StockQuote>
  stockList: StockQuote[]
  filteredList: StockQuote[]
  editList: boolean
  quoteToAdd?: StockQuote
  successMesage: string | null
  showAsGroup?: boolean
}

const StockSearchLayout = () => {
  const userController = useUserController()
  const defaultModel: Model = {
    username: userController.ticket?.email,
    isLoading: true,
    autoCompleteResults: [],
    searchedStocksMap: new Map<string, StockQuote>([]),
    stockListMap: new Map<string, StockQuote>([]),
    stockList: [],
    filteredList: [],
    editList: false,
    successMesage: null,
    showAsGroup: userController.authProfile?.settings?.stocks?.defaultView! === 'grouped' ?? undefined,
  }

  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

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
      setModel({ ...model, searchedStocksMap: searchedStocksMap, autoCompleteResults: autoComp, quoteToAdd: undefined, successMesage: null })
    }
  }

  const handleSelectQuote = (text: string) => {
    const symbol = text.split(':')[0]
    const quote = cloneDeep(model.searchedStocksMap.get(symbol))
    setModel({ ...model, isLoading: true })
    if (quote) {
      setModel({ ...model, quoteToAdd: quote, autoCompleteResults: [], successMesage: null })
    }
  }
  const reloadData = async () => {
    const profile = await userController.fetchProfilePassive()
    if (profile) {
      if (!profile.settings!.stocks) {
        profile.settings!.stocks = {
          defaultView: 'flat',
        }
        userController.setProfile(profile)
        putUserProfile(profile)
      }
    }
    setModel({ ...model, isLoading: true, successMesage: null })

    let stockList = [...model.stockList]
    let map = model.stockListMap

    if (profile) {
      stockList = await getUserStockList(profile.username)
      map = getMapFromArray(stockList, 'Symbol')
      setModel({
        ...model,
        username: profile.username,
        stockListMap: map,
        stockList: stockList,
        isLoading: false,
        filteredList: stockList,
        successMesage: null,
      })
    } else {
      setTimeout(() => {
        setModel({ ...model, username: null, stockListMap: map, stockList: stockList, filteredList: stockList, isLoading: false, successMesage: null })
      }, 1000)
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

      setModel({
        ...model,
        stockListMap: stockListMap,
        stockList: newList,
        autoCompleteResults: [],
        quoteToAdd: undefined,
        isLoading: false,
        filteredList: newList,
        successMesage: `${quote.Company} added!`,
      })
    } else {
      setModel({ ...model, quoteToAdd: undefined, isLoading: false, successMesage: `${quote.Company} is already in your list` })
    }
  }
  const handleCloseAddQuote = () => {
    setModel({ ...model, quoteToAdd: undefined, isLoading: false, successMesage: null })
  }
  const handleSearchListChange = async (text: string) => {
    const result = model.stockList.filter(
      (o) => o.Symbol.toLowerCase().startsWith(text.toLowerCase()) || o.Company.toLowerCase().startsWith(text.toLowerCase()),
    )
    setModel({ ...model, filteredList: result })
  }
  const handleSaveChanges = async (quotes: StockQuote[]) => {
    const newMap = getMapFromArray(quotes, 'Symbol')
    quotes.forEach((item) => {
      newMap.set(item.Symbol, item)
    })
    const newList = Array.from(newMap.values())
    if (model.username) {
      setModel({ ...model, successMesage: null })
      await putUserStockList(model.username, newList)
    }

    setModel({
      ...model,
      //isLoading: false,
      stockList: newList,
      stockListMap: newMap,
      filteredList: newList,
      successMesage: 'Your list has been updated!',
    })
  }

  const handleShowAsGroup = async (show: boolean) => {
    const profile = userController.authProfile
    if (profile) {
      setModel({ ...model, isLoading: true })
      if (!profile.settings?.stocks) {
        profile.settings!.stocks = {}
      }
      profile.settings!.stocks!.defaultView = show ? 'grouped' : 'flat'
      userController.setProfile(profile)
      await putUserProfile(profile)
      setModel({ ...model, isLoading: false })
    }

    setModel({ ...model, showAsGroup: show })
  }

  React.useEffect(() => {
    const fn = async () => {
      await reloadData()
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

  return (
    <>
      {model.successMesage && <SnackbarSuccess show={true} text={model.successMesage} />}
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
                  <EditList
                    username={model.username ?? null}
                    data={model.stockList}
                    onCancelEdit={() => setModel({ ...model, editList: false })}
                    onPushChanges={handleSaveChanges}
                    loading={model.isLoading}
                  />
                </>
              ) : (
                <>
                  {model.showAsGroup ? (
                    <Box>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box></Box>
                        <GroupedListMenu
                          onEdit={() => {
                            setModel({ ...model, editList: true })
                          }}
                          onRefresh={reloadData}
                          onShowAsGroup={handleShowAsGroup}
                        />
                      </Box>
                      <GroupedStocksLayout stockList={model.stockList} />
                    </Box>
                  ) : (
                    <Box>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box pl={1}>
                          {model.stockList.length >= 10 && !model.showAsGroup && (
                            <SearchWithinList onChanged={handleSearchListChange} debounceWaitMilliseconds={25} />
                          )}
                        </Box>
                        <FlatListMenu
                          onEdit={() => {
                            setModel({ ...model, editList: true })
                          }}
                          onRefresh={reloadData}
                          onShowAsGroup={handleShowAsGroup}
                        />
                      </Box>
                      <Box display={'flex'} justifyContent={'flex-end'}></Box>
                      <StockTable stockList={model.filteredList} isStock={true} />
                    </Box>
                  )}
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
