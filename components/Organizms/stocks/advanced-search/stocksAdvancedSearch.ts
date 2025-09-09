import { StockAdvancedSearchFilter } from './advancedSearchFilter'

export function hasMarketCapFilter(filter: StockAdvancedSearchFilter) {
  const result = filter.marketCap?.includeMegaCap || filter.marketCap?.includeLargeCap || filter.marketCap?.includeMidCap || filter.marketCap?.includeSmallCap
  return result
}
