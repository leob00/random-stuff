import { NumberRangeFilter, StockAdvancedSearchFilter, StockMarketCapFilter, StockMovingAvgFilter } from './advancedSearchFilter'

export function hasMarketCapFilter(filter: StockMarketCapFilter) {
  const result = filter.includeMegaCap || filter.includeLargeCap || filter.includeMidCap || filter.includeSmallCap
  return result
}

export function hasMovingAvgFilter(filter: StockMovingAvgFilter) {
  const result = !!filter.days
  return result
}
export function hasPeFilter(filter: NumberRangeFilter) {
  const result = filter.from || filter.to
  return result
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

export function summarizeFilter(filter: StockAdvancedSearchFilter) {
  let result = `top ${filter.take} market cap leaders`
  const filterCount = getFilterCount(filter)
  const hasMarketCap = hasMarketCapFilter(filter.marketCap)
  const hasMovingsAv = hasMovingAvgFilter(filter.movingAvg)
  const hasPe = hasPeFilter(filter.peRatio)
  const hasAnyFilter = filterCount > 0

  if (!hasAnyFilter) {
    return result
  }

  if (hasMarketCap) {
    result = `top ${filter.take} ${getMarketCapFilters(filter.marketCap).join(', ')} cap stocks `
  }
  if (hasMovingsAv) {
    result = `${result} by ${filter.movingAvg.days} day moving average `
    if (filter.movingAvg.from && filter.movingAvg.to) {
      result = `${result} between ${filter.movingAvg.from}% and ${filter.movingAvg.to}% `
    } else if (filter.movingAvg.from) {
      result = `${result} greater than or equal to ${filter.movingAvg.from}% `
    } else if (filter.movingAvg.to) {
      result = `${result} less than or equal to ${filter.movingAvg.to}% `
    }
  }
  if (filterCount > 2) {
    result = `${result} and `
  }
  if (hasPe) {
    if (filter.peRatio.from && filter.peRatio.to) {
      result = `${result} P/E between ${filter.peRatio.from} and ${filter.peRatio.to} `
    } else if (filter.peRatio.from) {
      result = `${result} P/E greater than or equal to ${filter.peRatio.from} `
    } else if (filter.peRatio.to) {
      result = `${result} P/E less than or equal to ${filter.peRatio.to} `
    }
  }
  return result
}

export type StockSavedSearch = {
  id?: string
  name: string
  filter: StockAdvancedSearchFilter
}
