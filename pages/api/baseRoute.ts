import { DynamoKeys, getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id')!
  //console.log(id)
  //  console.log('retrieved api data from edgeGetRandomStuff')
  return NextResponse.json({ id: id })
}
