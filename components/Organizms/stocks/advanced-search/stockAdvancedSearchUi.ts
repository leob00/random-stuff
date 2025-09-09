import { useReducer } from 'react'
import { StockAdvancedSearchFilter } from './advancedSearchFilter'
import { executeStockAdvancedSearch } from 'lib/backend/api/qln/qlnApi'
import { StockQuote } from 'lib/backend/api/models/zModels'

interface Model {
  expandMarketCap: boolean
  expandMovingAvg: boolean
  showResults: boolean
  isLoading: boolean
  results: StockQuote[]
}

export default function useAdvancedSearchUi() {
  const defaultModel: Model = {
    expandMarketCap: true,
    expandMovingAvg: true,
    showResults: false,
    isLoading: false,
    results: [],
  }
  const [model, setModel] = useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const executeSearch = async (filter: StockAdvancedSearchFilter) => {
    setModel({ ...model, isLoading: true, expandMarketCap: false, expandMovingAvg: false })
    const result = await executeStockAdvancedSearch(filter)
    const stocks = result.Body as StockQuote[]
    setModel({ ...model, isLoading: false, showResults: true, results: stocks, expandMarketCap: false, expandMovingAvg: false })
  }

  return {
    model,
    setModel,
    executeSearch,
  }
}

export type AdvancedSearchUiController = ReturnType<typeof useAdvancedSearchUi>
