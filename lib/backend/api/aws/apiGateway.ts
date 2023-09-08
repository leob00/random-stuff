import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { BasicArticle } from 'lib/model'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { apiConnection } from '../config'
import { get, post } from '../fetchFunctions'

export type DynamoKeys =
  | 'dogs'
  | 'cats'
  | 'coinflip-community'
  | 'wheelspin-community'
  | 'site-stats'
  | 'community-stocks'
  | 'user-stock_list'
  | 'stockportfolio'

const connection = apiConnection().aws
const apiGatewayUrl = connection.url
//export const apiGatewayUrl = String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL)

export type CategoryType = 'animals' | 'random' | 'userProfile' | 'community-stocks' | 'searched-stocks' | 'user-stock_list' | string

export interface RandomStuffPut {
  key: DynamoKeys | string
  data: BasicArticle[] | CoinFlipStats
  category: CategoryType
  expiration?: number
}

export interface LambdaDynamoRequest {
  id: string
  category: CategoryType | string
  data: any
  expiration: number
  token: string
}

export interface LambdaResponse {
  statusCode: number
  body: LambdaBody
}
export interface LambdaListResponse {
  statusCode: number
  body: LambdaBody[]
}
export interface LambdaBody {
  count?: number
  key?: string
  data: string
  last_modified?: string
  expiration?: number
}

export interface CoinFlipStats {
  heads: number
  tails: number
}
export interface WheelSpinStats {
  total: number
  red: number
  black: number
  zero: number
  doubleZero: number
  odd: number
  even: number
}

export interface UserPin {
  pin: string
  lastEnterDate: string
}
export type SortDirection = 'asc' | 'desc'

export type Sort = {
  key: string
  direction: 'asc' | 'desc'
}

export interface UserSettings {
  lastPath?: string
  news?: {
    lastNewsType?: string
  }
  stocks?: {
    defaultView?: 'flat' | 'grouped'
    sort?: {
      grouped: {
        main: Sort[]
        inside: Sort[]
      }
    }
    customSort?: Sort[]
  }
}

export interface UserProfile {
  id: string
  username: string
  secKey?: string
  pin?: UserPin
  emailVerified?: boolean
  settings?: UserSettings
}

export interface SiteStats {
  recipes: {
    lastRefreshDate: string
    featured: Recipe[]
  }
}

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
  console.log(`put ${articles.length} ${type} to Dynamo`)
}

export async function getAnimals(type: DynamoKeys) {
  const url = `${apiGatewayUrl}/animals?key=${type}`
  let response: LambdaResponse | null = null
  try {
    response = (await get(url)) as LambdaResponse
    let data = JSON.parse(response.body.data) as BasicArticle[]
    return data
  } catch (err) {
    console.log(`error in getAnimals: ${type} `, JSON.stringify(response))
    return []
  }
}

export async function getRandomStuff(key: DynamoKeys | string) {
  const url = `${apiGatewayUrl}/randomstuff?key=${key}`
  let result: LambdaResponse | null = null
  try {
    result = (await get(url)) as LambdaResponse
    if (result.body && result.body.data) {
      let data = JSON.parse(result.body.data)
      return data
    }
  } catch (err) {
    console.log('error in getRandomStuff: ', err)
  }

  return null
}
export async function searchRandomStuffBySecIndex(search: CategoryType | string) {
  const url = `${apiGatewayUrl}/searchrandomstuff`
  try {
    let result = await post(url, { key: search })
    return result.body as LambdaBody[]
  } catch (err) {
    console.log('error occurred in searchRandomStuffBySecIndex: ', err)
  }
  return []
}

export async function putRandomStuff(type: DynamoKeys, category: CategoryType, data: any, expiration?: number) {
  const url = `${apiGatewayUrl}/randomstuff`
  const model: RandomStuffPut = {
    key: type,
    data: data,
    category: category,
    expiration: expiration ?? 0,
  }
  const postData = {
    body: model,
  }
  try {
    await post(url, postData)
  } catch (error) {
    console.log('error in putRandomStuff')
  }
}
export async function putRandomStuffEnc(req: SignedRequest) {
  const decryptedString = weakDecrypt(req.data)
  const body = JSON.parse(decryptedString) as LambdaDynamoRequest
  if (!body) {
    console.log('putRandomStuff: body validation failed')
    return null
  }
  const id = weakDecrypt(body.token)
  if (body.id !== id) {
    console.log('token validation failed')
    return null
  }

  const url = `${apiGatewayUrl}/randomstuff`

  const model: RandomStuffPut = {
    key: body.id,
    data: body.data,
    category: body.category,
    expiration: body.expiration ?? 0,
  }
  const postData = {
    body: model,
  }
  try {
    await post(url, postData)
    return body
  } catch (error) {
    console.log('error in putRandomStuff')
    return null
  }
}

export async function deleteRandomStuff(key: string) {
  const url = `${apiGatewayUrl}/deleterandomstuff`
  let params = {
    key: key,
  }
  try {
    let resp = await post(url, params)
    return resp
  } catch (error) {
    console.log('error in deleteRandomStuff', error)
  }
  return { status: 'success' }
}

export async function getCoinflipStats() {
  let result = await getRandomStuff('coinflip-community')
  if (result) {
    return result as CoinFlipStats
  }
  return null
}
export async function getWheelSpinStats() {
  let item: WheelSpinStats = {
    total: 0,
    red: 0,
    black: 0,
    zero: 0,
    doubleZero: 0,
    odd: 0,
    even: 0,
  }
  try {
    let result = (await getRandomStuff('wheelspin-community')) as WheelSpinStats
    return result
  } catch (err) {}
  return item
}

export interface EmailMessage {
  to: string
  subject: string
  html: string
}

export async function sendEmail(message: EmailMessage) {
  const url = `${apiGatewayUrl}/sendemail`
  const response = (await post(url, message)) as LambdaResponse
  return response.body
}

export async function putCoinflipStats(data: CoinFlipStats) {
  await putRandomStuff('coinflip-community', 'random', data)
}
export async function putWheelSpinStats(data: WheelSpinStats) {
  await putRandomStuff('wheelspin-community', 'random', data)
}

export type StockPositionType = 'short' | 'long'
export interface StockPosition {
  portfolioId: string
  id: string
  name: string
  type: StockPositionType
  openQuantity: number
  realizedGainLoss?: number
  unrealizedGainLoss?: number
  stockSymbol: string
}
export interface StockPortfolio {
  id: string
  name: string
  positions: StockPosition[]
}
