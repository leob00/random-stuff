import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { deleteItem } from 'app/serverActions/aws/s3/s3'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, res: NextResponse) {
  const user = await getUserSSRAppRouteApi(req, res)
  if (!user) {
    return new Response(JSON.stringify('unauthorized'), { status: 403 })
  }
  const item = (await req.json()) as S3Object
  await deleteItem(item)
  return NextResponse.json(item)
}
