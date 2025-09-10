import { StockQuote } from 'lib/backend/api/models/zModels'
import { StockLayoutModel } from './StockSearchLayout'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import { useReducer, useState } from 'react'
import { putUserProfile, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { Box } from '@mui/material'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import AddQuote from './AddQuote'
import EditList from './EditList'
import FlatListMenu from './FlatListMenu'
import GroupedStocksLayout from './GroupedStocksLayout'
import { useUserController } from 'hooks/userController'
import { orderBy } from 'lodash'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import StocksCustomSortForm from './StocksCustomSortForm'
import CustomSortAlert from './CustomSortAlert'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PagedStockTable from './PagedStockTable'
import { LocalStore } from 'lib/backend/store/useLocalStore'
import SnackbarWarning from 'components/Atoms/Dialogs/SnackbarWarning'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuoteSort } from 'lib/backend/api/models/collections'
import StockSearch from 'components/Atoms/Inputs/StockSearch'

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
  localStore,
}: {
  userProfile: UserProfile | null
  result: StockQuote[]
  onMutated: (newData: StockQuote[]) => void
  localStore: LocalStore
}) => {
  const [showUserWarning, setShowUserWarning] = useState(userProfile === null)

  const userController = useUserController()
  const map = getMapFromArray(result, 'Symbol')
  const defaultModel: StockLayoutModel = {
    isLoading: false,
    autoCompleteResults: [],
    searchedStocksMap: new Map<string, StockQuote>([]),
    stockListMap: map,
    editList: false,
    successMesage: null,
    showAsGroup: userProfile ? userProfile.settings?.stocks?.defaultView! === 'grouped' : localStore.myStocks.defaultView === 'grouped',
  }

  const [model, setModel] = useReducer((state: StockLayoutModel, newState: StockLayoutModel) => ({ ...state, ...newState }), defaultModel)
  const customSort = userProfile ? userProfile.settings?.stocks?.customSort : localStore.myStocks.customSort
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
    let stockList = [...result]
    let stockListMap = getMapFromArray(stockList, 'Symbol')
    quote.GroupName = quote.Sector ?? 'Unassigned'
    if (!stockListMap.has(quote.Symbol)) {
      stockListMap.set(quote.Symbol, quote)
      const newList = getListFromMap(stockListMap).filter((m) => m.Symbol !== quote.Symbol)
      newList.unshift(quote)
      persistStocks(userProfile, localStore, newList)
      setModel({
        ...model,
        editList: true,
        showAsGroup: false,
        stockListMap: stockListMap,
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
    persistStocks(userProfile, localStore, newList)
    setModel({
      ...model,
      isLoading: false,
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
    persistStocks(userProfile, localStore, newList)
    setModel({
      ...model,
      isLoading: false,
      stockListMap: newMap,
      successMesage: 'Your list has been updated!',
    })
    onMutated(newList)
  }

  const handleShowAsGroup = async (show: boolean) => {
    if (userProfile) {
      const profile = { ...userProfile }
      if (!profile.settings?.stocks) {
        profile.settings!.stocks = {}
      }
      profile.settings!.stocks!.defaultView = show ? 'grouped' : 'flat'
      userController.setProfile(profile)
      putUserProfile(profile)
    } else {
      localStore.saveDefaultView(show ? 'grouped' : 'flat')
    }
    setModel({ ...model, isLoading: false, showAsGroup: show })
  }

  const handleShowCustomSort = () => {
    setModel({ ...model, showCustomSort: true })
  }
  const handleSubmitCustomSort = (data?: StockQuoteSort[]) => {
    setModel({ ...model, showCustomSort: false })
    if (userProfile) {
      const newProfile = { ...userProfile }
      newProfile.settings!.stocks!.customSort = data
      userController.setProfile(newProfile)
      putUserProfile(newProfile)
    } else {
      localStore.saveCustomSort(data)
    }
  }

  return (
    <>
      <ScrollIntoView enabled={true} margin={-13} />
      {model.successMesage && (
        <SnackbarSuccess
          show={!!model.successMesage}
          text={model.successMesage}
          onClose={() => {
            setModel({ ...model, successMesage: null })
          }}
        />
      )}
      {!model.quoteToAdd && (
        <Box py={2}>
          <StockSearch onSymbolSelected={handleSelectQuote} clearOnSelect showAdvSearch />
        </Box>
      )}
      {model.quoteToAdd ? (
        <AddQuote
          stockListMap={model.stockListMap}
          quote={model.quoteToAdd}
          handleAddToList={handleAddToList}
          handleCloseAddQuote={handleCloseAddQuote}
          scrollIntoView
          userProfile={userController.authProfile}
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
                    data={Array.from(model.stockListMap.values())}
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
                      {customSort && (
                        <CustomSortAlert result={customSort} onModify={() => setModel({ ...model, showCustomSort: true })} translateDefaultMessage />
                      )}
                      <PagedStockTable data={customSorted} showGroupName={true} />
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
          <StocksCustomSortForm result={userProfile?.settings?.stocks?.customSort ?? localStore.myStocks.customSort} onSubmitted={handleSubmitCustomSort} />
        </FormDialog>
      </>
      {showUserWarning && (
        <SnackbarWarning
          show={true}
          text='You are not signed in. All changes will only be saved on your local device.'
          onClose={() => setShowUserWarning(false)}
        />
      )}
    </>
  )
}

async function persistStocks(userProfile: UserProfile | null, localStore: LocalStore, list: StockQuote[]) {
  if (userProfile) {
    putUserStockList(userProfile.username, list)
  } else {
    localStore.saveStocks(list)
  }
}

export default StocksDisplay
