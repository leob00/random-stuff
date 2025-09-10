import { useReducer } from 'react'
import { StockAdvancedSearchFilter } from './advancedSearchFilter'
import { executeStockAdvancedSearch } from 'lib/backend/api/qln/qlnApi'
import { StockQuote } from 'lib/backend/api/models/zModels'

interface Model {
  expandMarketCap: boolean
  expandMovingAvg: boolean
  expandPeRatio: boolean
  showResults: boolean
  isLoading: boolean
  results: StockQuote[]
  filter: StockAdvancedSearchFilter
}

export default function useAdvancedSearchUi(filter: StockAdvancedSearchFilter) {
  const defaultModel: Model = {
    expandMarketCap: true,
    expandMovingAvg: true,
    expandPeRatio: true,
    showResults: false,
    isLoading: false,
    results: [],
    filter: filter,
  }
  const [model, setModel] = useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const executeSearch = async (filter: StockAdvancedSearchFilter) => {
    setModel({ ...model, isLoading: true, expandMarketCap: false, expandMovingAvg: false, expandPeRatio: false, filter: filter })
    const result = await executeStockAdvancedSearch(filter)
    const stocks = result.Body as StockQuote[]
    setModel({
      ...model,
      isLoading: false,
      showResults: true,
      results: stocks,
      expandMarketCap: false,
      expandMovingAvg: false,
      expandPeRatio: false,
      filter: filter,
    })
  }

  return {
    model,
    setModel,
    executeSearch,
  }
}

export type AdvancedSearchUiController = ReturnType<typeof useAdvancedSearchUi>
