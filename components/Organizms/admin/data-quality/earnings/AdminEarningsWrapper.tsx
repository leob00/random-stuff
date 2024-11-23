import { TableCell } from '@aws-amplify/ui-react'
import { Box, Button, Stack, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import FormDatePicker from 'components/Molecules/Forms/ReactHookForm/FormDatePicker'
import FormNumericTextField from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import StockChange from 'components/Organizms/stocks/StockChange'
import SearchBySymbolAccordion from 'components/Organizms/stocks/earnings/SearchBySymbolAccordion'
import { EarningsSearchFields } from 'components/Organizms/stocks/earnings/SearchEarningsBySymbolForm'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { StockEarning, getStockQuotes, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
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
  const handelSubmit = async (item: EarningsSearchFields) => {
    setModel({ ...model, error: null, isLoading: true, selectedItem: null })
    const quotes = await getStockQuotes([item.symbol])
    if (quotes.length > 0) {
      const endpoint = `/StockEarnings?symbol=${quotes[0].Symbol}`
      const resp = await serverGetFetch(endpoint)
      const searchResults = resp.Body as StockEarning[]
      setModel({ ...model, stockQuote: quotes[0], isSearchExpanded: false, isLoading: false, searchResults: searchResults })
    } else {
      setModel({ ...model, error: `unable to load quote: ${item.symbol}`, isLoading: false, searchResults: [] })
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
