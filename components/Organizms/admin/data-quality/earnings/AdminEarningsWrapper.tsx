import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import StockChange from 'components/Organizms/stocks/StockChange'
import SearchBySymbolAccordion from 'components/Organizms/stocks/earnings/SearchBySymbolAccordion'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { StockEarning, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { useReducer } from 'react'
import AdminEarningsTable from './AdminEarningsTable'

export type AdminEarningsModel = {
  isSearchExpanded: boolean
  stockQuote: StockQuote | null
  error: string | null
  searchResults: StockEarning[]
  isLoading: boolean
  selectedItem: StockEarning | null
}

const AdminEarningsWrapper = () => {
  const defaultModel: AdminEarningsModel = {
    isSearchExpanded: true,
    stockQuote: null,
    error: null,
    isLoading: false,
    searchResults: [],
    selectedItem: null,
  }

  const [model, setModel] = useReducer((state: AdminEarningsModel, newState: AdminEarningsModel) => ({ ...state, ...newState }), defaultModel)
  const handelSubmit = async (item: StockQuote) => {
    if (item.Symbol.length > 0) {
      setModel({ ...model, error: null, isLoading: true, selectedItem: null })

      const endpoint = `/StockEarnings?symbol=${item.Symbol}`
      const resp = await serverGetFetch(endpoint)
      const searchResults = resp.Body as StockEarning[]
      setModel({ ...model, stockQuote: item, isSearchExpanded: false, isLoading: false, searchResults: searchResults })
    }
  }
  const handleRefresh = async () => {
    if (model.stockQuote) {
      setModel({ ...model, isLoading: true })
      const endpoint = `/StockEarnings?symbol=${model.stockQuote.Symbol}`
      const resp = await serverGetFetch(endpoint)
      const searchResults = resp.Body as StockEarning[]
      setModel({ ...model, searchResults: searchResults, selectedItem: null, isLoading: false })
    }
  }

  return (
    <Box py={2} minHeight={500}>
      <SearchBySymbolAccordion
        handelSubmit={handelSubmit}
        isExpanded={model.isSearchExpanded}
        setIsExpanded={(isExpanded) => {
          setModel({ ...model, isSearchExpanded: isExpanded })
        }}
      />
      {model.isLoading && <BackdropLoader />}
      <Box>
        {model.stockQuote && (
          <Box py={2} display={'flex'} flexDirection={'column'} gap={1}>
            {model.error && <AlertWithHeader severity='error' text={model.error} header='Error' />}
            <ListHeader item={model.stockQuote} onClicked={() => {}} disabled text={`${model.stockQuote.Company} (${model.stockQuote.Symbol})`} elevation={0} />
            <StockChange item={model.stockQuote} />
          </Box>
        )}
      </Box>
      <Box>
        {model.searchResults.length > 0 && (
          <Box py={2}>
            <AdminEarningsTable model={model} setModel={setModel} onRefresh={handleRefresh} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AdminEarningsWrapper
