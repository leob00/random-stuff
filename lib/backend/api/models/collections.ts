import { StockQuote } from './zModels'

export type SortDirection = 'asc' | 'desc'

export type Sort = {
  key: string
  direction: SortDirection
}

export type StockQuoteSort = {
  key: keyof StockQuote
  direction: SortDirection
}
