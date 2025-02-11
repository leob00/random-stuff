import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUserSSRAppRouteApi } from 'lib/backend/server-side/serverSideAuth'
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3'
import { getPresignedUrl } from 'app/serverActions/aws/s3/s3'

export async function POST(req: NextRequest, res: NextResponse) {
  const user = await getUserSSRAppRouteApi(req, res)
  if (!user) {
    return new Response(JSON.stringify('unauthorized'), { status: 403 })
  }
  const item = (await req.json()) as S3Object

  const url = await getPresignedUrl(item)
  return NextResponse.json(url)
}
