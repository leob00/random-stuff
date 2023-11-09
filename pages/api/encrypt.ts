import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const json = await req.json()
  const enc = json as SignedRequest
  if (!enc.appId || enc.appId !== process.env.NEXT_PUBLIC_APP_ID) {
    return NextResponse.json({ status: 'unuathorized' })
  }
  const dec = weakEncrypt(enc.data)

  const result: SignedRequest = {
    data: dec,
  }
  return NextResponse.json(result)
}
