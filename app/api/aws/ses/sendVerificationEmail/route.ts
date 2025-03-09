import { verifyEmailIdentity } from 'app/serverActions/aws/ses/ses'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = (await request.json()) as string

  const result = await verifyEmailIdentity(data)
  return NextResponse.json(result)
}
