import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { deleteItem } from 'app/serverActions/aws/s3/s3'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { withAuth } from 'lib/backend/api/with-auth'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  const item = (await req.json()) as S3Object
  await deleteItem(item)
  return NextResponse.json(item)
}

export const DELETE = withAuth(handler)
