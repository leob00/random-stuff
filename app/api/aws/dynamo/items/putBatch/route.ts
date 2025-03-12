import { RandomStuffDynamoItem } from 'app/serverActions/aws/dynamo/dynamo'
import { putItems } from 'app/serverActions/aws/dynamo/dynamoBatch'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const enc = (await request.json()) as SignedRequest
  const dec = weakDecrypt(enc.data)
  if (!dec || dec.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const items = JSON.parse(dec) as RandomStuffDynamoItem[]
  const result = await putItems(items)
  return NextResponse.json(result)
}
