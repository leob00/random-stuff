import { StockQuote } from 'lib/backend/api/models/zModels'
import { StockLayoutModel } from './StockSearchLayout'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import { Sort, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import React from 'react'
import { putUserProfile, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { Box } from '@mui/material'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import AddQuote from './AddQuote'
import EditList from './EditList'
import FlatListMenu from './FlatListMenu'
import GroupedStocksLayout from './GroupedStocksLayout'
import StockTable from './StockTable'
import { useUserController } from 'hooks/userController'
import { orderBy } from 'lodash'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import StocksCustomSortForm from './StocksCustomSortForm'
import CustomSortAlert from './CustomSortAlert'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StocksLookup from './StocksLookup'

export const searchWithinResults = (quotes: StockQuote[], text: string) => {
  const result = quotes.filter(
    (o) =>
      o.Symbol.toLowerCase().includes(text.toLowerCase()) ||
      o.Company.toLowerCase().startsWith(text.toLowerCase()) ||
      (o.GroupName && o.GroupName.toLowerCase().includes(text.toLowerCase())),
  )
  return result
}
const StocksDisplay = ({
  userProfile,
  result,
  onMutated,
  onCustomSortUpdated,
}: {
  userProfile: UserProfile
  result: StockQuote[]
  onMutated: (newData: StockQuote[]) => void
  onCustomSortUpdated: (data?: Sort[]) => void
}) => {
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
  const customSort = userProfile.settings?.stocks?.customSort
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

  const handleSelectQuote = async (item: StockQuote) => {
    setModel({ ...model, quoteToAdd: item, autoCompleteResults: [], successMesage: null, isLoading: false })
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
    const newProfile = { ...userProfile }
    newProfile.settings!.stocks!.customSort = data
    userController.setProfile(newProfile)
    putUserProfile(newProfile)
  }

  return (
    <>
      <ScrollIntoView enabled={true} margin={-14} />
      {model.successMesage && <SnackbarSuccess show={true} text={model.successMesage} />}
      <Box py={2}>
        <StocksLookup onFound={handleSelectQuote} />
      </Box>
      {model.quoteToAdd ? (
        <AddQuote
          stockListMap={model.stockListMap}
          quote={model.quoteToAdd}
          handleAddToList={handleAddToList}
          handleCloseAddQuote={handleCloseAddQuote}
          scrollIntoView
        />
      ) : (
        <Box>
          {model.isLoading ? (
            <BackdropLoader />
          ) : (
            <Box py={2}>
              {model.editList && result.length > 0 ? (
                <>
                  <EditList
                    username={userProfile.username}
                    data={result}
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
                        stockList={result}
                        onEdit={() => setModel({ ...model, editList: true })}
                        onShowAsGroup={() => handleShowAsGroup(false)}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box pl={1}></Box>
                        <FlatListMenu
                          onEdit={() => setModel({ ...model, editList: true })}
                          onShowAsGroup={handleShowAsGroup}
                          onShowCustomSort={handleShowCustomSort}
                        />
                      </Box>
                      {customSort && <CustomSortAlert result={customSort} onModify={() => setModel({ ...model, showCustomSort: true })} />}
                      <StockTable stockList={customSorted} isStock={true} />
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      )}
      <>
        <FormDialog
          show={model.showCustomSort ?? false}
          title={'sort'}
          onCancel={() => setModel({ ...model, showCustomSort: false })}
          showActionButtons={false}
        >
          <StocksCustomSortForm result={userProfile.settings?.stocks?.customSort} onSubmitted={handleSubmitCustomSort} />
        </FormDialog>
      </>
    </>
  )
}
export default StocksDisplay
