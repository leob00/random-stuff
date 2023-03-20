import { EmailMessage, putRandomStuffEnc, sendEmail } from 'lib/backend/api/aws/apiGateway'
import { EncPutRequest } from 'lib/backend/csr/nextApiWrapper'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const json = (await req.json()) as EmailMessage
  //console.log(json)
  //const postData = JSON.parse(json) as EmailMessage

  //const request = (await req.json()) as EmailMessage

  const response = await sendEmail(json)
  //const body = await putRandomStuffEnc(enc)
  //if (!body) {
  //  return new Response(JSON.stringify({ message: 'api/putRandomStuff error: post failed' }), { status: 200 })
  //}

  return NextResponse.json({ status: 200, message: response })
}
