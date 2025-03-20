import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { apiConnection } from '../../config'
import { get, post } from 'lib/backend/api/fetchFunctions'
import { StockQuote } from '../../models/zModels'
import { BasicArticle, DynamoKeys, LambdaResponse, RandomStuffPut } from '../models/apiGatewayModels'

const connection = apiConnection().aws
const apiGatewayUrl = connection.url

export async function hello(name: string) {
  const url = `${apiGatewayUrl}/hello?name=${name}`
  let data = await get(url)
  return data as LambdaResponse
}

export async function deleteRandomStuffBatch(req: SignedRequest) {
  const decryptedString = weakDecrypt(req.data)
  const items = JSON.parse(decryptedString) as string[]
  const url = `${apiGatewayUrl}/deleterandomstuffbatch`
  try {
    await post(url, { records: items })
    return items
  } catch (error) {
    console.error('error in putRandomStuff')
    return null
  }
}

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
