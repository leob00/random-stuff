import { listCognitoUsers } from 'app/serverActions/aws/cognito/cognito'
import { withAuth } from 'lib/backend/api/with-auth'
import { NextRequest, NextResponse } from 'next/server'
import { AmplifyUser, userHasRole } from 'lib/backend/auth/userUtil'

const handler = async (req: NextRequest) => {
  const rsCred = req.headers.get('rs-cred')
  if (!rsCred) {
    return NextResponse.json('unauthorized', { status: 401 })
  }
  if (rsCred) {
    const user = JSON.parse(rsCred) as AmplifyUser
    if (!userHasRole('Admin', user.roles)) {
      return NextResponse.json('insuffiscient role', { status: 403 })
    }
  }

  const result = await listCognitoUsers()
  return NextResponse.json(result)
}

export const POST = withAuth(handler)
