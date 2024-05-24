import { get, post, postBody } from 'lib/backend/api/fetchFunctions'
import { QlnApiRequest } from 'lib/backend/api/qln/qlnApi'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge', // this is a pre-requisite
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') as string
  const result = await get(url)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') as string
  const body = (await req.json()) as QlnApiRequest
  const result = await postBody(url, 'POST', body)
  return NextResponse.json(result)
}
