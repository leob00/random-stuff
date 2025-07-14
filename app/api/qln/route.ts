import { apiConnection } from 'lib/backend/api/config'
import { get, postBody } from 'lib/backend/api/fetchFunctions'
import { QlnApiRequest } from 'lib/backend/api/qln/qlnApi'
import { NextRequest, NextResponse } from 'next/server'
//export const runtime = 'edge'

const apiKey = apiConnection().qln.key

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
    return NextResponse.json(await postBody(url, 'POST', request.body, { ApiKey: apiKey }))
  }

  const result = await postBody(url, 'POST', request, { ApiKey: apiKey })
  return NextResponse.json(result)
}

export async function DELETE(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') as string
  const request = (await req.json()) as QlnApiRequest
  if (request.body) {
    return NextResponse.json(await postBody(url, 'DELETE', request.body, { ApiKey: apiKey }))
  }

  const result = await postBody(url, 'DELETE', request, { ApiKey: apiKey })
  return NextResponse.json(result)
}
