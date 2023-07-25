import { SortableStockKeys, StockQuote } from 'lib/backend/api/models/zModels'
import { getSearchAheadTotalCount, searchAheadStocks } from './stockSearcher'
import { StockLayoutModel } from './StockSearchLayout'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import { Sort, UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import { DropdownItem } from 'lib/models/dropdown'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { putUserProfile, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
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
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { orderBy } from 'lodash'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import StocksCustomSortForm from './StocksCustomSortForm'
import LinkButton from 'components/Atoms/Buttons/LinkButton'

export const searchWithinResults = (quotes: StockQuote[], text: string) => {
  const result = quotes.filter((o) => o.Symbol.toLowerCase().includes(text.toLowerCase()) || o.Company.toLowerCase().startsWith(text.toLowerCase()) || (o.GroupName && o.GroupName.toLowerCase().includes(text.toLowerCase())))
  return result
}
const StocksDisplay = ({ userProfile, result, onMutated, onCustomSortUpdated }: { userProfile: UserProfile; result: StockQuote[]; onMutated: (newData: StockQuote[]) => void; onCustomSortUpdated: (data?: Sort[]) => void }) => {
  const userController = useUserController()
  let map = new Map<string, StockQuote>([])
  map = getMapFromArray(result, 'Symbol')
  const defaultModel: StockLayoutModel = {
    isLoading: false,
    autoCompleteResults: [],
    searchedStocksMap: new Map<string, StockQuote>([]),
    stockListMap: map,
    stockList: result,
    editList: false,
    successMesage: null,
    showAsGroup: userProfile.settings?.stocks?.defaultView! === 'grouped' ?? undefined,
  }

  const [model, setModel] = React.useReducer((state: StockLayoutModel, newState: StockLayoutModel) => ({ ...state, ...newState }), defaultModel)
  const customSort = userProfile.settings!.stocks!.customSort
  const orderStocks = (list: StockQuote[]) => {
    if (customSort) {
      const ordered = orderBy(
        list,
        customSort.map((m) => m.key),
        customSort.map((m) => m.direction),
      )
      return ordered
    }
    return list
  }

  const customSorted = orderStocks(result)

  const existingStockLookup = orderBy(result, ['Symbol'], ['asc']).map((m) => {
    return `${m.Symbol}: ${m.Company}`
  })

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
      const quote = quotes[0]
      const existing = result.find((m) => m.Symbol === quote.Symbol)
      if (existing) {
        quote.GroupName = existing.GroupName
      }
      setModel({ ...model, quoteToAdd: quote, autoCompleteResults: [], successMesage: null, isLoading: false })
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
    await putUserStockList(userProfile.username, newList)
    setModel({
      ...model,
      isLoading: false,
      stockList: newList,
      stockListMap: newMap,
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
    setModel({ ...model, isLoading: false, showAsGroup: show })
  }

  const handleShowCustomSort = () => {
    setModel({ ...model, showCustomSort: true })
  }
  const handleSubmitCustomSort = (data?: Sort[]) => {
    setModel({ ...model, showCustomSort: false })
    //console.log('sort: ', data)
    const newProfile = { ...userProfile }
    newProfile.settings!.stocks!.customSort = data
    userController.setProfile(newProfile)
    putUserProfile(newProfile)
  }

  const translateSort = (sort: Sort) => {
    let direction = `${sort.direction === 'desc' ? 'largest to smallest' : 'smallest to largest'}`
    const key = sort.key as keyof SortableStockKeys
    let resultField = sort.key
    switch (key) {
      case 'ChangePercent':
        resultField = 'change percent'
        break
      case 'MarketCap':
        resultField = 'market cap'
        break
      case 'Company':
      case 'Symbol':
        direction = `${sort.direction === 'desc' ? 'Z-A' : 'A-Z'}`
        break
    }

    return `'${resultField}' (${direction})`
  }

  return (
    <>
      {model.successMesage && <SnackbarSuccess show={true} text={model.successMesage} />}
      <Box py={2}>
        <CenterStack>
          <StocksAutoComplete placeholder={`search ${numeral(getSearchAheadTotalCount()).format('###,###')} stocks`} onChanged={handleSearched} searchResults={model.autoCompleteResults} debounceWaitMilliseconds={500} onSelected={handleSelectQuote} />
        </CenterStack>
      </Box>
      {model.quoteToAdd ? (
        <AddQuote stockListMap={model.stockListMap} quote={model.quoteToAdd} handleAddToList={handleAddToList} handleCloseAddQuote={handleCloseAddQuote} scrollIntoView />
      ) : (
        <Box>
          {model.isLoading ? (
            <>
              <WarmupBox />
              <LargeGridSkeleton />
            </>
          ) : (
            <Box py={2}>
              {model.editList && result.length > 0 ? (
                <>
                  <EditList username={userProfile.username} data={result} onCancelEdit={() => setModel({ ...model, editList: false })} onPushChanges={handleSaveChanges} onReorder={handleReorderList} state={model} setState={setModel} />
                </>
              ) : (
                <>
                  {model.showAsGroup ? (
                    <Box>
                      <GroupedStocksLayout userProfile={userProfile} stockList={result} onEdit={() => setModel({ ...model, editList: true })} onShowAsGroup={() => handleShowAsGroup(false)} scrollIntoView />
                    </Box>
                  ) : (
                    <Box>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box pl={1}>{result.length > 5 && <StaticAutoComplete options={existingStockLookup} onSelected={handleSelectQuote} placeholder={'search in your list'} />}</Box>
                        <FlatListMenu onEdit={() => setModel({ ...model, editList: true })} onShowAsGroup={handleShowAsGroup} onShowCustomSort={handleShowCustomSort} />
                      </Box>
                      {/* <Box display={'flex'} justifyContent={'flex-end'}></Box> */}
                      {customSort && (
                        <Box pl={1} pt={2}>
                          <Alert
                            severity='info'
                            action={
                              <Button color='secondary' size='small' onClick={() => setModel({ ...model, showCustomSort: true })}>
                                modify
                              </Button>
                            }>
                            <Typography variant='body2'>{`sorted by ${translateSort(customSort[0])}`}</Typography>
                          </Alert>
                        </Box>
                      )}
                      <StockTable stockList={customSorted} isStock={true} scrollIntoView scrollMargin={customSort ? -27 : -28} />
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      )}
      <>
        <FormDialog show={model.showCustomSort ?? false} title={'custom sort'} onCancel={() => setModel({ ...model, showCustomSort: false })} showActionButtons={false}>
          <StocksCustomSortForm result={userProfile.settings!} onSubmitted={handleSubmitCustomSort} />
        </FormDialog>
      </>
    </>
  )
}
export default StocksDisplay
