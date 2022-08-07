import { useAxios } from './useAxios'
const client = useAxios()
const baseUrl = process.env.AWS_API_GATEWAY_URL

export async function hello(name: string) {
  const url = `${baseUrl}/hello`

  console.log(`url: ${url}`)
  let data = await client.get(url)
  console.log(JSON.stringify(data))
}
