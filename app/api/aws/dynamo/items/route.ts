import { getItem, searchItems } from 'app/serverActions/aws/dynamo/dynamo'
import { deleteItems } from 'app/serverActions/aws/dynamo/dynamoBatch'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const enc = (await request.json()) as SignedRequest
  const dec = weakDecrypt(enc.data)
  if (!dec || dec.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const result = await searchItems(dec)
  return NextResponse.json(result)
}

export async function DELETE(request: NextRequest) {
  const enc = (await request.json()) as SignedRequest
  const ids = weakDecrypt(enc.data)
  if (!ids || ids.length === 0) {
    console.error('failed to decrypt data: ', enc.data)
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const items = JSON.parse(ids) as string[]
  const result = await deleteItems(items)
  return NextResponse.json(result)
}
