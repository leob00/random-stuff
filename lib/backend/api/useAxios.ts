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
  }
  const response = await axios.get(url, config)
  return response.data
}
