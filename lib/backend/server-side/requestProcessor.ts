import { isBrowser } from 'lib/util/system'
import { findLast } from 'lodash'
import { NextApiRequest } from 'next'

export async function authorizeGetRequest(req: NextApiRequest) {
  const providedToken = req.query['token'] as string | undefined
  if (!providedToken) {
    return false
  }
  if (process.env.NEXT_PUBLIC_API_TOKEN !== providedToken) {
    return false
  }
  return true
}
