import axios, { AxiosRequestConfig } from 'axios'
import { get } from '../fetchFunctions'

/* export const axiosGet = async (url: string, params?: any) => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
      ApiKey: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
    },
  }
  config.url = url
  config.method = 'GET'

  if (params) {
    config.params = params
    config.data = params
  }
  const response = await get(url, params)
  //console.log(response.data)

  return response
} */
/* export const axiosPut = async (url: string, postData: any) => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
      ApiKey: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
    },
  }
  config.url = url
  config.method = 'POST'
  const response = await axios.post(url, postData, config)
  return response.data
} */
