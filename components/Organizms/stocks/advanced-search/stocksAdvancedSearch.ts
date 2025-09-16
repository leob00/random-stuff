import { NumberRangeFilter, StockAdvancedSearchFilter, StockMarketCapFilter, StockMovingAvgFilter } from './advancedSearchFilter'

export function hasMarketCapFilter(filter: StockMarketCapFilter) {
  const result = filter.includeMegaCap || filter.includeLargeCap || filter.includeMidCap || filter.includeSmallCap
  return !!result
}

export function hasMovingAvgFilter(filter: StockMovingAvgFilter) {
  const result = !!filter.days
  return !!result
}
export function hasPeFilter(filter: NumberRangeFilter) {
  const result = filter.from || filter.to
  return !!result
}

export function getMarketCapFilters(filter: StockMarketCapFilter) {
  const result: string[] = []
  if (!hasMarketCapFilter(filter)) {
    return result
  }
  if (filter.includeMegaCap) {
    result.push('mega')
  }
  if (filter.includeLargeCap) {
    result.push('large')
  }
  if (filter.includeMidCap) {
    result.push('mid')
  }
  if (filter.includeSmallCap) {
    result.push('small')
  }

  return result
}

export function getFilterCount(filter: StockAdvancedSearchFilter) {
  let result = 0
  const hasMarketCap = hasMarketCapFilter(filter.marketCap)
  const hasMovingsAv = hasMovingAvgFilter(filter.movingAvg)
  const hasPe = hasPeFilter(filter.peRatio)
  if (hasMarketCap) {
    result++
  }
  if (hasMovingsAv) {
    result++
  }
  if (hasPe) {
    result++
  }
  return result
}

export type StoockFilterSummary = {
  filterCount: number
  hasMarketCap: boolean
  hasMovingAverage: boolean
  hasPeRatio: boolean
  summary: string
}

export function summarizeFilter(filter: StockAdvancedSearchFilter) {
  const result: StoockFilterSummary = {
    hasMarketCap: hasMarketCapFilter(filter.marketCap),
    hasMovingAverage: hasMovingAvgFilter(filter.movingAvg),
    hasPeRatio: hasPeFilter(filter.peRatio),
    filterCount: getFilterCount(filter),
    summary: `top ${filter.take} market cap leaders`,
  }

  if (result.filterCount === 0) {
    return result
  }

  if (result.hasMarketCap) {
    result.summary = `top ${filter.take} ${getMarketCapFilters(filter.marketCap).join(', ')} cap stocks `
  }
  if (result.hasMovingAverage) {
    result.summary = `${result.summary} by ${filter.movingAvg.days} day moving average `
    if (filter.movingAvg.from && filter.movingAvg.to) {
      result.summary = `${result.summary} between ${filter.movingAvg.from}% and ${filter.movingAvg.to}% `
    } else if (filter.movingAvg.from) {
      result.summary = `${result.summary} greater than or equal to ${filter.movingAvg.from}% `
    } else if (filter.movingAvg.to) {
      result.summary = `${result.summary} less than or equal to ${filter.movingAvg.to}% `
    }
  }
  if (result.filterCount > 2) {
    result.summary = `${result.summary} and `
  }
  if (result.hasPeRatio) {
    if (filter.peRatio.from && filter.peRatio.to) {
      result.summary = `${result.summary} P/E between ${filter.peRatio.from} and ${filter.peRatio.to} `
    } else if (filter.peRatio.from) {
      result.summary = `${result.summary} P/E greater than or equal to ${filter.peRatio.from} `
    } else if (filter.peRatio.to) {
      result.summary = `${result.summary} P/E less than or equal to ${filter.peRatio.to} `
    }
  }
  if (result.filterCount === 1) {
    if (result.hasMarketCap) {
      result.summary = `${result.summary} by market cap`
    }
  }
  return result
}

export type StockSavedSearch = {
  id?: string
  name: string
  filter: StockAdvancedSearchFilter
}
