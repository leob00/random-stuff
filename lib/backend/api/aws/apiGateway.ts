import { BoySharp } from '@mui/icons-material'
import { EncPutRequest } from 'lib/backend/csr/nextApiWrapper'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import { BasicArticle } from 'lib/model'
import { UserNote } from 'lib/models/randomStuffModels'
import { axiosGet, axiosPut } from './useAxios'

export type DynamoKeys = 'dogs' | 'cats' | 'coinflip-community' | 'wheelspin-community' | string
let baseUrl = process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL

type CategoryType = 'animals' | 'random' | 'userProfile' | string

export interface RandomStuffPut {
  key: DynamoKeys
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

export interface UserProfile {
  id: string
  username: string
  noteTitles: UserNote[]
}

export async function hello(name: string) {
  const url = `${baseUrl}/hello?name=${name}`
  let data = await axiosGet(url)
  return data as LambdaResponse
}

export async function putAnimals(type: DynamoKeys, data: BasicArticle[]) {
  const url = `${baseUrl}/animals`
  let model: RandomStuffPut = {
    key: type,
    data: data,
    category: 'animals',
  }
  let postData = {
    body: model,
  }
  let articles = postData.body.data as BasicArticle[]
  await axiosPut(url, postData)
  console.log(`put ${articles.length} ${type} to Dynamo`)
}

export async function getAnimals(type: DynamoKeys) {
  const url = `${baseUrl}/animals?key=${type}`
  let response = (await axiosGet(url)) as LambdaResponse
  let data = JSON.parse(response.body.data) as BasicArticle[]
  return data
}

export async function getRandomStuff(type: DynamoKeys) {
  const url = `${baseUrl}/randomstuff?key=${type}`
  let result: LambdaResponse | null = null
  try {
    result = (await axiosGet(url)) as LambdaResponse
    if (result.body && result.body.data) {
      let data = JSON.parse(result.body.data)
      return data
    }
  } catch (err) {
    console.log('error in getRandomStuff')
  }

  return null
}
export async function searchRandomStuffBySecIndex(search: CategoryType | string) {
  const url = `${baseUrl}/searchrandomstuff/`
  //console.log(url)
  let result: LambdaBody[] = []
  try {
    let raw = await axiosGet(url, { key: search })
    let response = raw as LambdaListResponse
    return response.body
  } catch (err) {
    console.log('error occurred in searchRandomStuffBySecIndex')
  }
  return result
}
export async function putRandomStuff(type: DynamoKeys, category: CategoryType, data: any, expiration?: number) {
  const url = `${baseUrl}/randomstuff`

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
    await axiosPut(url, postData)
  } catch (error) {
    console.log('error in putRandomStuff')
  }
}
export async function putRandomStuffEnc(req: EncPutRequest) {
  const json = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), req.data)
  const body = JSON.parse(json) as LambdaDynamoRequest
  if (!body) {
    console.log('putRandomStuff: body validation failed')
    return null
  }
  const id = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), body.token)
  if (body.id !== id) {
    console.log('body id: ', body.id)
    console.log('token validation failed')
    return null
  }

  const url = `${baseUrl}/randomstuff`

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
    await axiosPut(url, postData)
    return body
  } catch (error) {
    console.log('error in putRandomStuff')
    return null
  }
}

export async function deleteRandomStuff(key: string) {
  const url = `${baseUrl}/deleterandomstuff?key=${key}`
  let params = {
    key: key,
  }
  try {
    let resp = await axiosPut(url, params)
    //console.log(resp)
  } catch (error) {
    console.log('error in deleteRandomStuff', error)
  }
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
    let result = await getRandomStuff('wheelspin-community')
    if (result) {
      return result as WheelSpinStats
    }
  } catch (err) {
    await putRandomStuff('wheelspin-community', 'random', item)
  }
  return item
}

export async function putCoinflipStats(data: CoinFlipStats) {
  await putRandomStuff('coinflip-community', 'random', data)
}
export async function putWheelSpinStats(data: WheelSpinStats) {
  await putRandomStuff('wheelspin-community', 'random', data)
}
