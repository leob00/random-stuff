import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { getItem, searchItems } from 'app/serverActions/aws/dynamo/dynamo'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey, constructUserSecretSecondaryKey } from 'lib/backend/api/aws/util'
import { userSecretArraySchema } from 'lib/backend/api/models/zModels'
import { withAuth } from 'lib/backend/api/with-auth'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  const ticket = await getUserSSRAppRouteApi()
  if (ticket) {
    const profileResp = await getItem(constructUserProfileKey(ticket.email))
    const profile = JSON.parse(profileResp.data) as UserProfile
    if (profile) {
      //const encKey: string | null = `${ticket.id}-${profile.username}`
      const secretsResponse = await searchItems(constructUserSecretSecondaryKey(profile.username))
      const secrets = userSecretArraySchema.parse(secretsResponse.map((item) => JSON.parse(item.data)))
      return NextResponse.json(secrets)
    }
  }

  return NextResponse.json([])
}

export const POST = withAuth(handler)
