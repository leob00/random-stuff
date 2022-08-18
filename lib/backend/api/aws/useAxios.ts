import axios, { AxiosRequestConfig } from 'axios'
const key = process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY as string
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
export const axiosPut = async (url: string, postData: any) => {
  config.url = url
  config.method = 'POST'
  const response = await axios.post(url, postData, config)
  //console.log(`axiosPut status: ${response.status}`)
  return response.data
}
