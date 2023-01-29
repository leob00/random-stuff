import axios, { AxiosRequestConfig } from 'axios'

export const axiosGet = async (url: string, params?: any) => {
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
  const response = await axios.get(url, config)
  //console.log(response.data)

  return response.data
}
export const axiosPut = async (url: string, postData: any) => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
    },
  }
  config.url = url
  config.method = 'POST'
  const response = await axios.post(url, postData, config)
  return response.data
}
