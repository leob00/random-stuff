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
import { putUserProfile, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import React from 'react'
import AddQuote from './AddQuote'
import EditList from './EditList'
import FlatListMenu from './FlatListMenu'
import GroupedStocksLayout from './GroupedStocksLayout'
import StockTable from './StockTable'
import { getSearchAheadTotalCount, searchAheadStocks } from './stockSearcher'
import numeral from 'numeral'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import useSWR, { mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'

interface StockLayoutModel {
  isLoading: boolean
  autoCompleteResults: DropdownItem[]
  searchedStocksMap: Map<string, SymbolCompany>
  stockListMap: Map<string, StockQuote>
  stockList: StockQuote[]
  filteredList: StockQuote[]
  editList: boolean
  quoteToAdd?: StockQuote
  successMesage: string | null
  showAsGroup?: boolean
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

const StockSearchLayoutUseSWR = ({ userProfile }: { userProfile: UserProfile }) => {
  const userController = useUserController()

  const enc = encodeURIComponent(weakEncrypt(`user-stock_list[${userProfile.username}]`))
  //console.log(enc)
  const fetchData = async (url: string, enc: string) => {
    const result = (await get(url, { enc: enc })) as StockQuote[]
    return result
  }
  const { data } = useSWR(['/api/edgeGetRandomStuff', enc], ([url, enc]) => fetchData(url, enc))
  //console.log(data)

  let map = new Map<string, StockQuote>([])
  if (data) {
    map = getMapFromArray(data, 'Symbol')
  }

  const defaultModel: StockLayoutModel = {
    isLoading: false,
    autoCompleteResults: [],
    searchedStocksMap: new Map<string, StockQuote>([]),
    stockListMap: map,
    stockList: data ?? [],
    filteredList: data ?? [],
    editList: false,
    successMesage: null,
    showAsGroup: userController.authProfile?.settings?.stocks?.defaultView! === 'grouped' ?? undefined,
  }

  const [model, setModel] = React.useReducer((state: StockLayoutModel, newState: StockLayoutModel) => ({ ...state, ...newState }), defaultModel)

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
    const symbol = text.split(':')[0]
    setModel({ ...model, isLoading: true })
    const quotes = await getStockQuotes([symbol])
    //setModel({ ...model, isLoading: true })
    if (quotes.length > 0) {
      setModel({ ...model, quoteToAdd: quotes[0], autoCompleteResults: [], successMesage: null, isLoading: false })
    }
  }

  const handleAddToList = async () => {
    const quote = { ...model.quoteToAdd! }
    let stockList = [...model.stockList]
    let stockListMap = getMapFromArray(stockList, 'Symbol')
    quote.GroupName = quote.Sector ?? 'Unassigned'
    if (!stockListMap.has(quote.Symbol)) {
      stockListMap.set(quote.Symbol, quote)
      const newList = getListFromMap(stockListMap).filter((m) => m.Symbol !== quote.Symbol)
      newList.unshift(quote)

      putUserStockList(userProfile.username, newList)

      setModel({
        ...model,
        editList: false,
        showAsGroup: false,
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleCloseAddQuote = () => {
    setModel({ ...model, quoteToAdd: undefined, isLoading: false, successMesage: null })
  }
  const handleSearchListChange = async (text: string) => {
    const result = searchWithinResults(model.stockList, text)
    setModel({ ...model, filteredList: result })
  }

  const handleSaveChanges = async (quotes: StockQuote[]) => {
    setModel({ ...model, isLoading: true, successMesage: null })
    const newMap = getMapFromArray(quotes, 'Symbol')
    quotes.forEach((item) => {
      newMap.set(item.Symbol, item)
    })
    const newList = Array.from(newMap.values())
    await putUserStockList(userProfile.username, newList)
    setModel({
      ...model,
      isLoading: false,
      stockList: newList,
      stockListMap: newMap,
      filteredList: newList,
      successMesage: 'Your list has been updated!',
    })
  }
  const handleReorderList = async (quotes: StockQuote[]) => {
    const newMap = getMapFromArray(quotes, 'Symbol')
    quotes.forEach((item) => {
      newMap.set(item.Symbol, item)
    })
    const newList = Array.from(newMap.values())
    putUserStockList(userProfile.username, newList)
    setModel({
      ...model,
      isLoading: false,
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

    setModel({ ...model, filteredList: show ? model.stockList : model.filteredList, showAsGroup: show })
  }

  const handleReloadData = async () => {
    mutate(`/api/edgeGetRandomStuff?enc=${enc}`)
    setModel({ ...model, isLoading: false, successMesage: null })
  }

  return (
    <>
      {model.successMesage && <SnackbarSuccess show={true} text={model.successMesage} />}
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
          {model.isLoading && (
            <>
              <WarmupBox />
              <LargeGridSkeleton />
            </>
          )}
          <Box py={2}>
            {model.editList && model.stockList.length > 0 ? (
              <>
                <EditList
                  username={userProfile.username}
                  data={model.stockList}
                  onCancelEdit={() => setModel({ ...model, editList: false })}
                  onPushChanges={handleSaveChanges}
                  onReorder={handleReorderList}
                  state={model}
                  setState={setModel}
                />
              </>
            ) : (
              <>
                {model.showAsGroup
                  ? data && (
                      <Box>
                        <GroupedStocksLayout
                          userProfile={userController.authProfile}
                          stockList={model.filteredList}
                          onRefresh={handleReloadData}
                          onEdit={() => setModel({ ...model, editList: true })}
                          onShowAsGroup={() => handleShowAsGroup(false)}
                        />
                      </Box>
                    )
                  : data && (
                      <Box>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                          <Box pl={1}>
                            {model.stockList.length >= 10 && !model.showAsGroup && (
                              <SearchWithinList onChanged={handleSearchListChange} debounceWaitMilliseconds={25} />
                            )}
                          </Box>
                          <FlatListMenu onEdit={() => setModel({ ...model, editList: true })} onRefresh={handleReloadData} onShowAsGroup={handleShowAsGroup} />
                        </Box>
                        <Box display={'flex'} justifyContent={'flex-end'}></Box>
                        <StockTable stockList={model.filteredList} isStock={true} />
                      </Box>
                    )}
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  )
}

export default StockSearchLayoutUseSWR
