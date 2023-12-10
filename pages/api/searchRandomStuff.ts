import { searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const json = await req.json()
  const enc = json as SignedRequest
  const dec = weakDecrypt(enc.data)
  const result = await searchRandomStuffBySecIndex(dec)
  return NextResponse.json(result)
}
