import { getItem, type RandomStuffDynamoItem, putItem, deleteItem } from 'app/serverActions/aws/dynamo/dynamo'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
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
  // authenticate
  // const user = getUserSSRAppRouteApi(request, response)
  // if (!user) {
  //   return new Response(JSON.stringify('unauthorized'), { status: 403 })
  // }
  const dec = weakDecrypt(enc.data)
  if (!dec || dec.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const body = JSON.parse(dec) as RandomStuffDynamoItem
  if (!body) {
    return new Response(JSON.stringify({ message: 'failed to parse request' }), { status: 500 })
  }
  const id = weakDecrypt(body.token!)
  if (body.key !== id) {
    return new Response(JSON.stringify({ message: 'token validation failed' }), { status: 403 })
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
