import { searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { EncPutRequest } from 'lib/backend/csr/nextApiWrapper'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge', // this is a pre-requisite
}

export default async function handler(req: NextRequest) {
  const json = await req.json()
  const enc = json as EncPutRequest
  const dec = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), enc.data)
  const result = await searchRandomStuffBySecIndex(dec)
  return NextResponse.json(result)
}
