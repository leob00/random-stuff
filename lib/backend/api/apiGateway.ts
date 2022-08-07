import { axiosGet } from './useAxios'

const baseUrl = process.env.AWS_API_GATEWAY_URL

export async function hello(name: string) {
  const url = `${baseUrl}/hello`
  let data = await axiosGet(url)
  console.log(JSON.stringify(data))
}
