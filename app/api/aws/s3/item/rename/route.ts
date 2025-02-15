import { copyItem, deleteItem } from 'app/serverActions/aws/s3/s3'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUserSSRAppRouteApi } from 'lib/backend/server-side/serverSideAuth'
import { NextRequest, NextResponse } from 'next/server'

type Payload = {
  oldItem: S3Object
  newPath: string
}

export async function POST(req: NextRequest, res: NextResponse) {
  const user = await getUserSSRAppRouteApi(req, res)
  if (!user) {
    return NextResponse.json('unauthorized', { status: 403 })
  }

  const item = (await req.json()) as Payload

  const resp = await copyItem(item.oldItem, item.newPath)
  if (resp.httpStatusCode === 200) {
    await deleteItem(item.oldItem)
  }

  return NextResponse.json(item)
}
