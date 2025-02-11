import { type RandomStuffItemRequest, getItem, RandomStuffDynamoItem, putItem, deleteItem } from 'app/serverActions/aws/dynamo/dynamo'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { getUtcNow } from 'lib/util/dateUtil'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const enc = (await request.json()) as SignedRequest
  const dec = weakDecrypt(enc.data)
  if (!dec || dec.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const result = await getItem(dec)
  return NextResponse.json(result)
}

export async function PUT(request: NextRequest) {
  const enc = (await request.json()) as SignedRequest
  const dec = weakDecrypt(enc.data)
  if (!dec || dec.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const dynamoRequest = JSON.parse(dec) as RandomStuffItemRequest
  if (!dynamoRequest) {
    return new Response(JSON.stringify({ message: 'failed to parse request' }), { status: 500 })
  }
  const id = weakDecrypt(dynamoRequest.token!)
  if (dynamoRequest.id !== id) {
    return new Response(JSON.stringify({ message: 'token validation failed' }), { status: 403 })
  }
  const body: RandomStuffDynamoItem = {
    key: dynamoRequest.id,
    category: dynamoRequest.category,
    data: dynamoRequest.data,
    count: Array.isArray(dynamoRequest.data) ? dynamoRequest.data.length : 1,
    expiration: dynamoRequest.expiration,
    last_modified: getUtcNow().format(),
  }
  await putItem(body)
  return NextResponse.json(body)
}
export async function DELETE(request: NextRequest) {
  const enc = (await request.json()) as SignedRequest
  const id = weakDecrypt(enc.data)
  if (!id || id.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const result = await deleteItem(id)
  return NextResponse.json(result)
}
