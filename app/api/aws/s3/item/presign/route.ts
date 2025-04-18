import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl } from 'app/serverActions/aws/s3/s3'
import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'

export async function POST(req: NextRequest) {
  const user = await getUserSSRAppRouteApi()
  if (!user) {
    return NextResponse.json('unauthorized', { status: 403 })
  }
  const item = (await req.json()) as S3Object

  const url = await getPresignedUrl(item)
  return NextResponse.json(url)
}
