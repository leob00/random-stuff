import { StockAdvancedSearchFilter } from './advancedSearchFilter'

export function hasMarketCapFilter(filter: StockAdvancedSearchFilter) {
  const result = filter.marketCap?.includeMegaCap || filter.marketCap?.includeLargeCap || filter.marketCap?.includeMidCap || filter.marketCap?.includeSmallCap
  return result
}

export function hasMovingAvgFilter(filter: StockAdvancedSearchFilter) {
  const result = !!filter.movingAvg.days
  return result
}
