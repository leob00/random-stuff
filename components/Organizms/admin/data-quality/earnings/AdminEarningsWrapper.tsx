'use client'
import { Box } from '@mui/material'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import StockChange from 'components/Organizms/stocks/StockChange'
import SearchBySymbolAccordion from 'components/Organizms/stocks/earnings/SearchBySymbolAccordion'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { StockEarning, getStockQuote, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { useEffect, useReducer } from 'react'
import AdminEarningsTable from './AdminEarningsTable'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { useSearchParams } from 'next/navigation'
import RequireClaim from 'components/Organizms/user/RequireClaim'

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
  const searchParams = useSearchParams()
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
  useEffect(() => {
    const dataFn = async () => {
      const symbolParam = searchParams?.get('symbol')
      if (symbolParam) {
        const symbol = symbolParam as string
        const quote = await getStockQuote(symbol)
        if (quote) {
          const endpoint = `/StockEarnings?symbol=${quote.Symbol}`
          const resp = await serverGetFetch(endpoint)
          const searchResults = resp.Body as StockEarning[]
          setModel({ ...model, stockQuote: quote, isSearchExpanded: false, isLoading: false, searchResults: searchResults })
        }
      }
    }
    dataFn()
  }, [])

  return (
    <>
      <RequireClaim claimType='rs-admin'>
        <Box py={2} minHeight={750}>
          <SearchBySymbolAccordion
            handelSubmit={handelSubmit}
            isExpanded={model.isSearchExpanded}
            setIsExpanded={(isExpanded) => {
              setModel({ ...model, isSearchExpanded: isExpanded })
            }}
          />
          {model.isLoading && <ComponentLoader />}
          <Box>
            {model.stockQuote && (
              <Box py={2} display={'flex'} flexDirection={'column'} gap={1}>
                {model.error && <AlertWithHeader severity='error' text={model.error} header='Error' />}
                <ListHeader
                  item={model.stockQuote}
                  onClicked={() => {}}
                  disabled
                  text={`${model.stockQuote.Company} (${model.stockQuote.Symbol})`}
                  fadeIn={false}
                />
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
      </RequireClaim>
    </>
  )
}

export default AdminEarningsWrapper
