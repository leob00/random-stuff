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

export async function putAnimals(type: DynamoKeys, data: BasicArticle[]) {
  const url = `${apiGatewayUrl}/animals`
  let model: RandomStuffPut = {
    key: type,
    data: data,
    category: 'animals',
  }
  let postData = {
    body: model,
  }
  let articles = postData.body.data as BasicArticle[]
  await post(url, postData)
}

export async function getAnimals(type: DynamoKeys) {
  const url = `${apiGatewayUrl}/animals?key=${type}`
  let response: LambdaResponse | null = null
  try {
    response = (await get(url)) as LambdaResponse
    let data = JSON.parse(response.body.data) as BasicArticle[]
    return data
  } catch (err) {
    console.error(`error in getAnimals: ${type} `, JSON.stringify(response))
    return []
  }
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
