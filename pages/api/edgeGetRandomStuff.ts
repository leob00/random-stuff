import { DynamoKeys, getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextRequest) => {
  const enc = decodeURIComponent(req.nextUrl.searchParams.get('enc')!)
  const id = weakDecrypt(enc)
  const arg = id as DynamoKeys | string
  const result = await getRandomStuff(arg)
  return NextResponse.json(result)
}
