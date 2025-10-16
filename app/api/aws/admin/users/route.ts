import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { getUserPool } from 'app/serverActions/aws/cognito/cognito'
import { getItem, searchItems } from 'app/serverActions/aws/dynamo/dynamo'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey, constructUserSecretSecondaryKey } from 'lib/backend/api/aws/util'
import { userSecretArraySchema } from 'lib/backend/api/models/zModels'
import { withAuth } from 'lib/backend/api/with-auth'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  const result = await getUserPool()
  console.log(result)

  return NextResponse.json(result)
}

export const POST = withAuth(handler)
