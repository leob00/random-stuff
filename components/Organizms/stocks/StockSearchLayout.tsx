import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import StocksAutoComplete from 'components/Atoms/Inputs/StocksAutoComplete'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import { useUserController } from 'hooks/userController'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes, SymbolCompany } from 'lib/backend/api/qln/qlnApi'
import { getUserStockList, putUserProfile, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import AddQuote from './AddQuote'
import EditList from './EditList'
import FlatListMenu from './FlatListMenu'
import GroupedStocksLayout from './GroupedStocksLayout'
import StockTable from './StockTable'
import { getSearchAheadTotalCount, searchAheadStocks } from './stockSearcher'
import numeral from 'numeral'
import { useEffect, useReducer } from 'react'

export interface StockLayoutModel {
  username?: string | null
  isLoading: boolean
  autoCompleteResults: DropdownItem[]
  searchedStocksMap: Map<string, SymbolCompany>
  stockListMap: Map<string, StockQuote>
  stockList?: StockQuote[]
  editList: boolean
  quoteToAdd?: StockQuote
  successMesage: string | null
  showAsGroup?: boolean
  showCustomSort?: boolean
}

export const searchWithinResults = (quotes: StockQuote[], text: string) => {
  const result = quotes.filter(
    (o) =>
      o.Symbol.toLowerCase().includes(text.toLowerCase()) ||
      o.Company.toLowerCase().startsWith(text.toLowerCase()) ||
      (o.GroupName && o.GroupName.toLowerCase().includes(text.toLowerCase())),
  )
  return result
}

const StockSearchLayout = () => {
  const { ticket, authProfile, fetchProfilePassive, setProfile } = useUserController()
  const defaultModel: StockLayoutModel = {
    username: ticket?.email,
    isLoading: true,
    autoCompleteResults: [],
    searchedStocksMap: new Map<string, StockQuote>([]),
    stockListMap: new Map<string, StockQuote>([]),
    stockList: [],
    editList: false,
    successMesage: null,
    showAsGroup: authProfile?.settings?.stocks?.defaultView === 'grouped',
  }

  const [model, setModel] = useReducer((state: StockLayoutModel, newState: StockLayoutModel) => ({ ...state, ...newState }), defaultModel)

  const handleSearched = async (text: string) => {
    const searchResults = searchAheadStocks(text)

    const autoComp: DropdownItem[] = searchResults.map((e) => {
      return {
        text: `${e.Symbol}: ${e.Company}`,
        value: e.Symbol,
      }
    })

    setModel({ ...model, autoCompleteResults: autoComp, quoteToAdd: undefined, successMesage: null })
  }

  const handleSelectQuote = async (text: string) => {
    if (text.length === 0) {
      return
    }
    const symbol = text.split(':')[0]
    setModel({ ...model, isLoading: true })
    const quotes = await getStockQuotes([symbol])
    //setModel({ ...model, isLoading: true })
    if (quotes.length > 0) {
      setModel({ ...model, quoteToAdd: quotes[0], autoCompleteResults: [], successMesage: null, isLoading: false })
    }
  }
  const reloadData = async () => {
    const profile = await fetchProfilePassive()
    if (profile) {
      if (!profile.settings!.stocks) {
        profile.settings!.stocks = {
          defaultView: 'flat',
        }
        setProfile(profile)
        await putUserProfile(profile)
      }
    }

    let stockList = [...(model.stockList ?? [])]
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
        successMesage: null,
      })
    } else {
      setTimeout(() => {
        setModel({ ...model, username: null, stockListMap: map, stockList: stockList, isLoading: false, successMesage: null })
      }, 1000)
    }
  }

  const handleAddToList = async () => {
    const quote = { ...model.quoteToAdd! }
    let stockList = [...(model.stockList ?? [])]
    let stockListMap = getMapFromArray(stockList, 'Symbol')
    quote.GroupName = quote.Sector ?? 'Unassigned'
    if (!stockListMap.has(quote.Symbol)) {
      stockListMap.set(quote.Symbol, quote)
      const newList = getListFromMap(stockListMap).filter((m) => m.Symbol !== quote.Symbol)
      newList.unshift(quote)

      if (model.username) {
        putUserStockList(model.username, newList)
      }

      setModel({
        ...model,
        editList: false,
        showAsGroup: false,
        stockListMap: stockListMap,
        stockList: newList,
        autoCompleteResults: [],
        quoteToAdd: undefined,
        isLoading: false,
        successMesage: `${quote.Company} added!`,
      })
    } else {
      setModel({ ...model, quoteToAdd: undefined, isLoading: false, successMesage: `${quote.Company} is already in your list` })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleCloseAddQuote = () => {
    setModel({ ...model, quoteToAdd: undefined, isLoading: false, successMesage: null })
  }

  const handleSaveChanges = async (quotes: StockQuote[]) => {
    setModel({ ...model, isLoading: true, successMesage: null })
    const newMap = getMapFromArray(quotes, 'Symbol')
    quotes.forEach((item) => {
      newMap.set(item.Symbol, item)
    })
    const newList = Array.from(newMap.values())
    if (model.username) {
      await putUserStockList(model.username, newList)
    }
    setModel({
      ...model,
      isLoading: false,
      stockList: newList,
      stockListMap: newMap,
      successMesage: 'Your list has been updated!',
    })
  }
  const handleReorderList = async (quotes: StockQuote[]) => {
    const newMap = getMapFromArray(quotes, 'Symbol')
    quotes.forEach((item) => {
      newMap.set(item.Symbol, item)
    })
    const newList = Array.from(newMap.values())
    if (model.username) {
      putUserStockList(model.username, newList)
    }
    setModel({
      ...model,
      isLoading: false,
      stockList: newList,
      stockListMap: newMap,
      successMesage: 'Your list has been updated!',
    })
  }

  const handleShowAsGroup = async (show: boolean) => {
    const profile = authProfile
    if (profile) {
      setModel({ ...model, isLoading: true })
      if (!profile.settings?.stocks) {
        profile.settings!.stocks = {}
      }
      profile.settings!.stocks!.defaultView = show ? 'grouped' : 'flat'
      setProfile(profile)
      await putUserProfile(profile)
      setModel({ ...model, isLoading: false })
    }

    setModel({ ...model, showAsGroup: show })
  }

  const handleReloadData = async () => {
    setModel({ ...model, isLoading: true, successMesage: null })
    await reloadData()
  }

  useEffect(() => {
    const fn = async () => {
      await reloadData()
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])

  return (
    <>
      {model.successMesage && (
        <SnackbarSuccess
          show={!!model.successMesage}
          text={model.successMesage}
          onClose={() => {
            setModel({ ...model, successMesage: null })
          }}
        />
      )}
      <Box py={2}>
        <CenterStack>
          <StocksAutoComplete
            placeholder={`search ${numeral(getSearchAheadTotalCount()).format('###,###')} stocks`}
            onChanged={handleSearched}
            searchResults={model.autoCompleteResults}
            debounceWaitMilliseconds={500}
            onSelected={handleSelectQuote}
          />
        </CenterStack>
      </Box>
      {model.quoteToAdd ? (
        <AddQuote stockListMap={model.stockListMap} quote={model.quoteToAdd} handleAddToList={handleAddToList} handleCloseAddQuote={handleCloseAddQuote} />
      ) : (
        <Box>
          {model.isLoading ? (
            <>
              <WarmupBox />
              <LargeGridSkeleton />
            </>
          ) : (
            <Box py={2}>
              {model.editList && model.stockList && model.stockList.length > 0 ? (
                <>
                  <EditList
                    username={model.username ?? null}
                    data={model.stockList}
                    onCancelEdit={() => setModel({ ...model, editList: false })}
                    onPushChanges={handleSaveChanges}
                    onReorder={handleReorderList}
                  />
                </>
              ) : (
                <>
                  {model.showAsGroup ? (
                    <Box>
                      <GroupedStocksLayout
                        userProfile={authProfile}
                        stockList={model.stockList ?? []}
                        onEdit={() => setModel({ ...model, editList: true })}
                        onShowAsGroup={() => handleShowAsGroup(false)}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <FlatListMenu onEdit={() => setModel({ ...model, editList: true })} onShowAsGroup={handleShowAsGroup} />
                      </Box>
                      <Box display={'flex'} justifyContent={'flex-end'}></Box>
                      <StockTable stockList={model.stockList ?? []} isStock={true} />
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
