import { deleteRandomStuffBatch, putRandomStuffBatchEnc, putRandomStuffEnc } from 'lib/backend/api/aws/apiGateway'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const enc = (await req.json()) as SignedRequest
  const body = await deleteRandomStuffBatch(enc)

  if (!body) {
    return new Response(JSON.stringify({ message: 'api/putRandomStuffBatch error: post failed' }), { status: 200 })
  }

  return NextResponse.json(body)
}
