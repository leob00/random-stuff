import { StockQuote } from 'lib/backend/api/models/zModels'
import { getSearchAheadTotalCount, searchAheadStocks } from './stockSearcher'
import { StockLayoutModel } from './StockSearchLayout'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import { DropdownItem } from 'lib/models/dropdown'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { putUserProfile, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import StocksAutoComplete from 'components/Atoms/Inputs/StocksAutoComplete'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import numeral from 'numeral'
import AddQuote from './AddQuote'
import EditList from './EditList'
import FlatListMenu from './FlatListMenu'
import GroupedStocksLayout from './GroupedStocksLayout'
import StockTable from './StockTable'
import { useUserController } from 'hooks/userController'

export const searchWithinResults = (quotes: StockQuote[], text: string) => {
  const result = quotes.filter(
    (o) =>
      o.Symbol.toLowerCase().includes(text.toLowerCase()) ||
      o.Company.toLowerCase().startsWith(text.toLowerCase()) ||
      (o.GroupName && o.GroupName.toLowerCase().includes(text.toLowerCase())),
  )
  return result
}
const StocksDisplay = ({ userProfile, result, onMutated }: { userProfile: UserProfile; result: StockQuote[]; onMutated: (newData: StockQuote[]) => void }) => {
  const userController = useUserController()
  let map = new Map<string, StockQuote>([])
  map = getMapFromArray(result, 'Symbol')
  const defaultModel: StockLayoutModel = {
    isLoading: false,
    autoCompleteResults: [],
    searchedStocksMap: new Map<string, StockQuote>([]),
    stockListMap: map,
    stockList: result,
    filteredList: result,
    editList: false,
    successMesage: null,
    showAsGroup: userProfile.settings?.stocks?.defaultView! === 'grouped' ?? undefined,
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
      onMutated(newList)
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
    onMutated(newList)
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
    onMutated(newList)
  }

  const handleShowAsGroup = async (show: boolean) => {
    const profile = { ...userProfile }
    if (!profile.settings?.stocks) {
      profile.settings!.stocks = {}
    }
    profile.settings!.stocks!.defaultView = show ? 'grouped' : 'flat'
    userController.setProfile(profile)
    putUserProfile(profile)
    setModel({ ...model, isLoading: false, filteredList: show ? model.stockList : model.filteredList, showAsGroup: show })
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
                {model.showAsGroup ? (
                  <Box>
                    <GroupedStocksLayout
                      userProfile={userProfile}
                      stockList={model.filteredList}
                      onEdit={() => setModel({ ...model, editList: true })}
                      onShowAsGroup={() => handleShowAsGroup(false)}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Box pl={1}>
                        {model.stockList.length >= 10 && !model.showAsGroup && (
                          <SearchWithinList onChanged={handleSearchListChange} debounceWaitMilliseconds={25} />
                        )}
                      </Box>
                      <FlatListMenu onEdit={() => setModel({ ...model, editList: true })} onShowAsGroup={handleShowAsGroup} />
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
export default StocksDisplay
