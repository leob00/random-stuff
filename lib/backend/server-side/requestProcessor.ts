import { NextApiRequest } from 'next'
import { apiConnection } from '../api/config'

export async function authorizeGetRequest(req: NextApiRequest) {
  const config = apiConnection().internal
  const providedToken = req.query['token'] as string | undefined
  if (!providedToken) {
    return false
  }
  if (config.key !== providedToken) {
    return false
  }
  return true
}
