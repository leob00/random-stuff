'use server'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'

const config = apiConnection().qln
export async function responseFromGet(endPoint: string, params?: any) {
  const url = `${config.url}/${endPoint}`
  const resp = (await get(url, params)) as QlnApiResponse
  return resp
}
