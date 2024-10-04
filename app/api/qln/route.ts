import { get, postBody } from 'lib/backend/api/fetchFunctions'
import { QlnApiRequest } from 'lib/backend/api/qln/qlnApi'
import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') as string
  const decodedUrl = decodeURIComponent(url)
  const result = await get(decodedUrl)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') as string
  const request = (await req.json()) as QlnApiRequest
  if (request.body) {
    return NextResponse.json(await postBody(url, 'POST', request.body))
  }

  const result = await postBody(url, 'POST', request)
  return NextResponse.json(result)
}
