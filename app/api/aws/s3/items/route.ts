import { deleteItem, listObjects } from 'app/serverActions/aws/s3/s3'
import { Bucket, S3Folder, S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { S3Key, SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { getUserSSRAppRouteApi } from 'lib/backend/server-side/serverSideAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
  const user = await getUserSSRAppRouteApi(req, res)
  if (!user) {
    return new Response(JSON.stringify('unauthorized'), { status: 403 })
  }

  const enc = (await req.json()) as SignedRequest
  const dec = weakDecrypt(enc.data)
  if (!dec || dec.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const folder = JSON.parse(dec) as S3Folder
  const resp = await listObjects(folder.bucket, folder.prefix)
  if (!resp) {
    return NextResponse.json([])
  }
  const result: S3Key[] = resp!.map((m) => {
    return {
      key: m.Key ?? '',
      size: m.Size ?? 0,
    }
  })
  return NextResponse.json(result)
}
