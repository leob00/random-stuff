import { findLast } from 'lodash'
import { NextApiRequest } from 'next'

export async function authorizeRequest(req: NextApiRequest) {
  const authCookie = findLast(Object.keys(req.cookies), (e) => {
    return e.includes('CognitoIdentityServiceProvider')
  })
  if (authCookie) {
    return true
  }
  return false
}
