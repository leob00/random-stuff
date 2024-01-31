import axios, { AxiosRequestConfig } from 'axios'
import { apiConnection } from '../config'
const conn = apiConnection()
const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': conn.aws.key,
    ApiKey: conn.qln.key,
  },
}

/* export const axiosGet = async (url: string, params?: any) => {
  config.url = url
  config.method = 'GET'

  if (params) {
    config.params = params
    config.data = params
  }
  try {
    const response = await axios.get(url, config)

    return response.data
  } catch (err) {
    throw 'error in get'
  }
}
export const axiosPut = async (url: string, postData: any) => {
  config.url = url
  config.method = 'POST'
  const response = await axios.post(url, postData, config)
  return response.data
} */
