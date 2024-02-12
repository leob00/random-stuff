import { StockQuote } from 'lib/backend/api/models/zModels'

export function excludeFinancialInstruments(stocks: StockQuote[]) {
  return stocks.filter((e) => !e.Company.toLowerCase().endsWith('etn') && !e.Company.toLowerCase().endsWith('etf') && !e.Company.endsWith('trust'))
}
