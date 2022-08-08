import axios, { AxiosRequestConfig } from 'axios'
const key = process.env.AWS_API_GATEWAY_PUBLIC_KEY as string
const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': key,
  },
}

export const axiosGet = async (url: string, params?: any) => {
  config.url = url
  config.method = 'GET'

  if (params) {
    config.params = params
    config.data = params
  }
  //console.log(`get:: ${url}`)
  const response = await axios.get(url, config)
  return response.data
}
export const axiosPut = async (url: string, data?: any) => {
  config.url = url
  config.method = 'POST'
  let body = {
    data: data,
  }
  if (data) {
    //config.params = body
  }
  const response = await axios.post(url, body, config)
  return response.data
}
