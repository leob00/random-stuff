import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const uri = await req.json()

  const response = await fetch(uri)
  const result = await response.blob()
  return new NextResponse(result, { status: 200, statusText: 'OK' })
}
