import { StockQuote } from '../../models/zModels'

export type StockPositionType = 'short' | 'long'
export type StockTransactionType = 'buy' | 'sell' | 'sell short' | 'buy to cover'
export type StockPositionStatus = 'open' | 'closed'
export interface StockPosition {
  portfolioId: string
  id: string
  name: string
  type: StockPositionType
  openQuantity: number
  realizedGainLoss?: number
  unrealizedGainLoss?: number
  stockSymbol: string
  date: string | null
  quote?: StockQuote
  status: StockPositionStatus
  transactions: StockTransaction[]
}
export interface StockTransaction {
  id: string
  positionId: string
  type: StockTransactionType
  quantity: number
  price: number
  isClosing?: boolean
  date: string | null
  status: StockPositionStatus
  gainLoss?: number
  cost?: number
  value?: number
  originalTransactions?: StockTransaction[]
}

export interface StockPortfolio {
  id: string
  name: string
  gainLoss?: number
}
