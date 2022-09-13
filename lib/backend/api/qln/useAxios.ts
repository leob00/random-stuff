import axios, { AxiosRequestConfig } from 'axios'
const awsKey = process.env.NEXT_QLN_API_PUBLIC_KEY as string
const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': awsKey,
  },
}

export const axiosGet = async (url: string, params?: any) => {
  config.url = url
  config.method = 'GET'

  if (params) {
    config.params = params
    config.data = params
  }
  const response = await axios.get(url, config)
  return response.data
}
export const axiosPut = async (url: string, postData: any) => {
  config.url = url
  config.method = 'POST'
  const response = await axios.post(url, postData, config)
  return response.data
}
