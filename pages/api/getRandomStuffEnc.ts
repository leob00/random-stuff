import { getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge', // this is a pre-requisite
}

export default async function handler(req: NextRequest) {
  const enc = (await req.json()) as SignedRequest
  const dec = weakDecrypt(enc.data)
  if (dec.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 403 })
  }
  const result = await getRandomStuff(dec)
  return NextResponse.json(result)
}
