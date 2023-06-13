import { searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt, weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  //const apiKey = req.nextUrl.searchParams.get('apiKey')
  const json = await req.json()
  const enc = json as SignedRequest
  if (!enc.appId || enc.appId !== process.env.NEXT_PUBLIC_APP_ID) {
    return NextResponse.json({ status: 'unuathorized' })
  }
  const dec = weakEncrypt(enc.data)
  console.log('appId ', enc.appId)
  //const result = await searchRandomStuffBySecIndex(dec)

  const result: SignedRequest = {
    data: dec,
  }
  return NextResponse.json(result)
}
