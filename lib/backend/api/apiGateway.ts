import { BasicArticle, BasicArticleTypes } from 'lib/model'
import { axiosGet, axiosPut } from './useAxios'

const baseUrl = process.env.AWS_API_GATEWAY_URL

export interface LambdaResponse {
  statusCode: number
  body: string
}

export async function hello(name: string) {
  const url = `${baseUrl}/hello?name=${name}`
  let data = await axiosGet(url)
  return data as LambdaResponse
}

export async function putAnimals(data: BasicArticle[]) {
  if (data.length === 0) {
    return
  }
  const url = `${baseUrl}/animals`
  await axiosPut(url, JSON.stringify(data))
  console.log(`put ${data.length} ${data[0].type} to Dynamo`)
}

export async function getAnimals(type: BasicArticleTypes) {
  const url = `${baseUrl}/animals?key=${type}`
  let response = await axiosGet(url)
  //console.log(response.body.data)
  let data = JSON.parse(response.body.data) as BasicArticle[]
  if (data.length > 0) {
    console.log(`returned ${data.length} ${data[0].type} from api`)
  }
  return []
}
