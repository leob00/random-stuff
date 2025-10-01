import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { getItem } from 'app/serverActions/aws/dynamo/dynamo'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { UserSecret } from 'lib/backend/api/models/zModels'
import { withAuth } from 'lib/backend/api/with-auth'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  const secret = (await req.json()) as UserSecret
  const ticket = await getUserSSRAppRouteApi()
  if (ticket) {
    const profileResp = await getItem(constructUserProfileKey(ticket.email))
    const profile = JSON.parse(profileResp.data) as UserProfile
    if (profile) {
      if (profile.pin) {
        const encKey = `${ticket.id}-${profile.username}`
        const decrypted = myDecrypt(encKey, secret.secret)
        return NextResponse.json({ ...secret, secret: decrypted })
      }
    }
  }
  return NextResponse.json('user secret decryption failed', { status: 403 })
}
export const POST = withAuth(handler)
