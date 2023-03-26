import { getRandomStuff, LambdaBody } from 'lib/backend/api/aws/apiGateway'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge', // this is a pre-requisite
}

export default async function handler(req: NextRequest) {
  const enc = (await req.json()) as SignedRequest
  const dec = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), enc.data)
  //console.log('decrypted: ', dec)
  if (dec.length === 0) {
    return new Response(JSON.stringify({ message: 'validation failed' }), { status: 200 })
    //res.status(403).send('Validation Failed. Token does not match.')
    //return
  }

  const result = await getRandomStuff(dec)

  return NextResponse.json(result)
  //  res.status(200).json(result)
}
