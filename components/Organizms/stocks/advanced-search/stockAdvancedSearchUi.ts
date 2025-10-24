import { useEffect, useReducer } from 'react'
import { StockAdvancedSearchFilter } from './advancedSearchFilter'
import { executeStockAdvancedSearch } from 'lib/backend/api/qln/qlnApi'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { sortArray } from 'lib/util/collections'

interface Model {
  expandMarketCap: boolean
  expandMovingAvg: boolean
  expandPeRatio: boolean
  expandAnnualYield: boolean
  expandSymbols: boolean
  showResults: boolean
  isLoading: boolean
  results: StockQuote[]
  filter: StockAdvancedSearchFilter
  allowSave: boolean
}

export default function useAdvancedSearchUi(filter?: StockAdvancedSearchFilter) {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()

  const defaultModel: Model = {
    expandMarketCap: true,
    expandMovingAvg: false,
    expandPeRatio: false,
    expandAnnualYield: false,
    expandSymbols: false,
    showResults: false,
    isLoading: isValidatingProfile,

    results: [],
    filter: filter ?? {
      marketCap: {
        includeMegaCap: false,
        includeLargeCap: false,
        includeMidCap: false,
        includeSmallCap: false,
      },
      take: 100,
      movingAvg: {
        days: 0,
      },
      peRatio: {},
      annualYield: {},
    },
    allowSave: userProfile !== null,
  }
  const [model, setModel] = useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  useEffect(() => {
    if (!isValidatingProfile) {
      setModel({ ...model, isLoading: false, allowSave: userProfile !== null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidatingProfile, userProfile])

  const executeSearch = async (filter: StockAdvancedSearchFilter) => {
    setModel({ ...model, isLoading: true, expandMarketCap: false, expandMovingAvg: false, expandPeRatio: false, expandSymbols: false, filter: filter })
    const result = await executeStockAdvancedSearch(filter)
    let stocks = result.Body as StockQuote[]
    if (filter.symbols && filter.symbols.length > 0) {
      stocks = sortArray(stocks, ['Symbol'], ['asc'])
    }
    setModel({
      ...model,
      isLoading: false,
      showResults: true,
      results: stocks,
      expandMarketCap: false,
      expandMovingAvg: false,
      expandPeRatio: false,
      expandSymbols: false,
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
