import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { getItem } from 'app/serverActions/aws/dynamo/dynamo'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { withAuth } from 'lib/backend/api/with-auth'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  const userPin = await req.json()
  let isValid = false
  const ticket = await getUserSSRAppRouteApi()
  if (ticket) {
    const profileResp = await getItem(constructUserProfileKey(ticket.email))
    const profile = JSON.parse(profileResp.data) as UserProfile
    if (profile) {
      const encKey = `${profile.id}${profile.username}`
      if (profile.pin) {
        const decrypted = myDecrypt(encKey, profile.pin.pin)
        if (decrypted === userPin) {
          isValid = true
        }
      }
    }
  }

  //const result = weakEncrypt(enc)
  if (isValid) {
    return NextResponse.json(isValid)
  }
  return NextResponse.json('pin validation failed', { status: 403 })
}
export const POST = withAuth(handler)
