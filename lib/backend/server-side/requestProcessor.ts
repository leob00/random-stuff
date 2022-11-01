import { isBrowser } from 'lib/util/system'
import { findLast } from 'lodash'
import { NextApiRequest } from 'next'

export async function authorizeRequest(req: NextApiRequest) {
  const isClientSide = isBrowser()

  const authCookie = findLast(Object.keys(req.cookies), (e) => {
    return e.includes('CognitoIdentityServiceProvider')
  })
  console.log(`authorizing request: ${isClientSide ? 'client' : 'server'}`)
  if (authCookie) {
    return true
  }
  return false
}
