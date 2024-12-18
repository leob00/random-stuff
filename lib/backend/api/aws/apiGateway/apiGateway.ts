import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { apiConnection } from '../../config'
import { get, post, postBody } from 'lib/backend/api/fetchFunctions'
import { StockAlertSubscription, StockQuote } from '../../models/zModels'
import { BasicArticle, Bucket, CategoryType, CoinFlipStats, DynamoKeys, EmailMessage, LambdaBody, LambdaDynamoRequest, LambdaDynamoRequestBatch, LambdaResponse, RandomStuffPut, S3Object, WheelSpinStats } from '../models/apiGatewayModels'
import { constructStockAlertsSubSecondaryKey } from '../util'

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
    const result = await post(url, postData)
    if (result.errorMessage) {
      console.error(result)
    }
    return dynamoRequest
  } catch (error) {
    console.error(`error in putRandomStuffEnc: ${error}`)
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

export async function sendEmail(message: EmailMessage) {
  const url = `${apiGatewayUrl}/sendemail`
  const response = (await post(url, message)) as LambdaResponse
  return response.body
}

export async function putWheelSpinStats(data: WheelSpinStats) {
  await putRandomStuff('wheelspin-community', 'random', data)
}

export async function putS3(bucket: Bucket, prefix: string, filename: string, mimeType: string, fileSize: number, body: any) {
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
      size: fileSize,
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
