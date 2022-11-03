import axios, { AxiosRequestConfig } from 'axios'

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
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
  //console.log(response.data)

  return response.data
}
export const axiosPut = async (url: string, postData: any) => {
  config.url = url
  config.method = 'POST'
  const response = await axios.post(url, postData, config)
  return response.data
}
