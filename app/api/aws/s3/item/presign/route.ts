import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl } from 'app/serverActions/aws/s3/s3'
import { withAuth } from 'lib/backend/api/with-auth'

const handler = async (req: NextRequest) => {
  const item = (await req.json()) as S3Object

  const url = await getPresignedUrl(item)
  return NextResponse.json(url)
}

export const POST = withAuth(handler)
