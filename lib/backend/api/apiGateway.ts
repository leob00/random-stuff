import { BasicArticle, BasicArticleTypes } from 'lib/model'
import { axiosGet, axiosPut } from './useAxios'

const baseUrl = process.env.AWS_API_GATEWAY_URL

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

export async function hello(name: string) {
  const url = `${baseUrl}/hello?name=${name}`
  let data = await axiosGet(url)
  return data as LambdaResponse
}

export async function putAnimals(type: BasicArticleTypes, data: BasicArticle[]) {
  if (data.length === 0) {
    return
  }
  const url = `${baseUrl}/animals`
  let postData = {
    body: data,
  }
  await axiosPut(url, postData)
  console.log(`put ${postData.body.length} ${type} to Dynamo`)
}

export async function getAnimals(type: BasicArticleTypes) {
  const url = `${baseUrl}/animals?key=${type}`
  let response = (await axiosGet(url)) as LambdaResponse
  let data = JSON.parse(response.body.data) as BasicArticle[]
  return data
}