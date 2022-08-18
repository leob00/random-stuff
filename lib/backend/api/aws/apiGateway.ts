import { BasicArticle, BasicArticleTypes } from 'lib/model'
import { axiosGet, axiosPut } from './useAxios'

export type DynamoKeys = 'dogs' | 'cats' | 'coinflip-community'
let baseUrl = process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL

export interface RandomStuffPut {
  key: DynamoKeys
  data: BasicArticle[] | CoinFlipStats
}

export interface LambdaResponse {
  statusCode: number
  body: LambdaBody
}
export interface LambdaBody {
  count?: number
  key?: string
  data: string
  last_modified?: string
}

export interface CoinFlipStats {
  heads: number
  tails: number
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
  let response = (await axiosGet(url)) as LambdaResponse
  if (response.body && response.body.data) {
    let data = JSON.parse(response.body.data)
    return data
  }
  return null
}
export async function putRandomStuff(type: DynamoKeys, data: any) {
  const url = `${baseUrl}/randomstuff`
  let model: RandomStuffPut = {
    key: type,
    data: data,
  }
  let postData = {
    body: model,
  }
  try {
    await axiosPut(url, postData)
    console.log(`put ${type} to Dynamo`)
  } catch (error) {
    console.log(error)
  }
}

export async function getCoinflipStats() {
  let result = await getRandomStuff('coinflip-community')
  if (result) {
    return result as CoinFlipStats
  }
  return null
}

export async function putCoinflipStats(data: CoinFlipStats) {
  await putRandomStuff('coinflip-community', data)
}
