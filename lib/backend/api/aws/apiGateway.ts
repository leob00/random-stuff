import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { BasicArticle } from 'lib/model'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { DropdownItem } from 'lib/models/dropdown'
import { apiConnection } from '../config'
import { get, post, postBody, postDelete } from '../fetchFunctions'
import { StockAlertSubscription, StockQuote } from '../models/zModels'
import { constructStockAlertsSubSecondaryKey } from './util'

export type Bucket = 'rs-files'

export type DynamoKeys =
  | 'dogs'
  | 'cats'
  | 'coinflip-community'
  | 'wheelspin-community'
  | 'site-stats'
  | 'community-stocks'
  | 'user-stock_list'
  | 'stockportfolio'
  | 'email-template[stock-alert]'
  | 'stocks-daily-market-sentiment'

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
  token?: string
}

export interface LambdaDynamoRequestBatch {
  records: LambdaDynamoRequest[]
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
  category?: string
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
  folders?: DropdownItem[]
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
    console.error('error in getRandomStuff: ', err)
  }

  return null
}
export async function searchRandomStuffBySecIndex(search: CategoryType | string) {
  const url = `${apiGatewayUrl}/searchrandomstuff`
  try {
    let result = await post(url, { key: search })
    return result.body as LambdaBody[]
  } catch (err) {
    console.error('error occurred in searchRandomStuffBySecIndex: ', err)
  }
  return []
}

export async function getS3ObjectPresignedUrl(bucket: string, fullPath: string, expirationInSeconds: number) {
  const url = `${apiGatewayUrl}/s3/presignedurl`
  try {
    const body = { bucket: bucket, fullPath: fullPath, expiration: expirationInSeconds }
    const result = await post(url, body)
    return result.body
  } catch (err) {
    console.error('error occurred in presignedurl: ', err)
  }
  return []
}
export async function listS3Objects(bucket: Bucket, prefix: string) {
  const url = `${apiGatewayUrl}/s3/list`
  try {
    const body = { bucket: bucket, prefix: prefix }
    const result = await post(url, body)
    return result.body
  } catch (err) {
    console.error('error occurred in presignedurl: ', err)
  }
  return []
}

export async function deleteS3Object(bucket: string, fullPath: string) {
  const url = `${apiGatewayUrl}/s3/object`
  try {
    const result = await postBody(url, 'DELETE', { bucket: bucket, fullPath: fullPath })
    return result
  } catch (err) {
    console.error('error occurred in postDelete: ', err)
  }
  return []
}

export async function renameS3Object(bucket: Bucket, oldPath: string, newPath: string) {
  const url = `${apiGatewayUrl}/s3/object`
  try {
    const result = await postBody(url, 'PATCH', {
      bucket: bucket,
      oldPath: oldPath,
      newPath: newPath,
    })
    return result
  } catch (err) {
    console.error('error occurred in postDelete: ', err)
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
    console.error('error in putRandomStuff')
  }
}
export async function putRandomStuffEnc(req: SignedRequest) {
  const decryptedString = weakDecrypt(req.data)
  const dynamoRequest = JSON.parse(decryptedString) as LambdaDynamoRequest
  if (!dynamoRequest) {
    console.error('putRandomStuffEnc: signed request validation failed')
    return null
  }
  const id = weakDecrypt(dynamoRequest.token!)
  if (dynamoRequest.id !== id) {
    console.error('token validation failed')
    return null
  }

  const url = `${apiGatewayUrl}/randomstuff`

  const model: RandomStuffPut = {
    key: dynamoRequest.id,
    data: dynamoRequest.data,
    category: dynamoRequest.category,
    expiration: dynamoRequest.expiration ?? 0,
  }
  const postData = {
    body: model,
  }
  try {
    await post(url, postData)
    return dynamoRequest
  } catch (error) {
    console.error('error in putRandomStuff')
    return null
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

export async function putRandomStuffBatch(data: LambdaDynamoRequest[]) {
  const url = `${apiGatewayUrl}/randomstuffbatch`
  const postData: RandomStuffPut[] = data.map((m) => {
    return {
      key: m.id,
      category: m.category,
      expiration: m.expiration,
      data: m.data,
    }
  })
  try {
    await post(url, { records: postData })
  } catch (error) {
    console.error('error in putRandomStuff')
    return null
  }
}

export async function putRandomStuffBatchEnc(req: SignedRequest) {
  const decryptedString = weakDecrypt(req.data)
  const dynamoRequest = JSON.parse(decryptedString) as LambdaDynamoRequestBatch
  if (!dynamoRequest) {
    console.error('putRandomStuffBatchEnc: signed request validation failed')
    return null
  }

  const url = `${apiGatewayUrl}/randomstuffbatch`
  const postData: RandomStuffPut[] = dynamoRequest.records.map((m) => {
    return {
      key: m.id,
      category: m.category,
      expiration: m.expiration,
      data: m.data,
    }
  })
  try {
    await post(url, { records: postData })

    return dynamoRequest
  } catch (error) {
    console.error('error in putRandomStuff')
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
    console.error('error in deleteRandomStuff', error)
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

export async function putS3(bucket: Bucket, prefix: string, filename: string, mimeType: string, body: any) {
  const url = `${apiGatewayUrl}/s3Direct/${bucket}/${prefix}/${filename}`
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: body,
      headers: { 'x-api-key': connection.key, 'Content-Type': mimeType },
    })
    const result: S3Object = {
      bucket: bucket,
      prefix: `${prefix}`,
      filename: filename,
      fullPath: `${prefix}/${filename}`,
    }
    if (response.status === 413) {
      result.message = 'File is too large'
    }

    return result
  } catch (error) {
    console.error('error in putS3: ', error)
    return null
  }
}
export async function getSesAttributes(username: string) {
  const response = (await postBody(`${apiGatewayUrl}/ses`, 'POST', { key: username })) as LambdaResponse
  return response.body
}
export async function sendSesEmailVerification(username: string) {
  const response = await postBody(`${apiGatewayUrl}/ses`, 'PUT', { key: username })
}

export async function updateSubscriptions(items: StockAlertSubscription[], username: string) {
  const records: LambdaDynamoRequest[] = items.map((m) => {
    return {
      id: m.id,
      category: constructStockAlertsSubSecondaryKey(username),
      data: m,
      expiration: 0,
    }
  })
  await putRandomStuffBatch(records)
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

export interface S3Object {
  bucket: Bucket
  prefix: string
  filename: string
  isFolder?: boolean
  size?: number
  message?: string
  fullPath: string
}
