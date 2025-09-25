import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { copyItem, deleteItem } from 'app/serverActions/aws/s3/s3'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { withAuth } from 'lib/backend/api/with-auth'
import { NextRequest, NextResponse } from 'next/server'

type Payload = {
  oldItem: S3Object
  newPath: string
}

const handler = async (req: NextRequest) => {
  const item = (await req.json()) as Payload

  const resp = await copyItem(item.oldItem, item.newPath)
  if (resp.httpStatusCode === 200) {
    await deleteItem(item.oldItem)
  }

  return NextResponse.json(item)
}

export const POST = withAuth(handler)
