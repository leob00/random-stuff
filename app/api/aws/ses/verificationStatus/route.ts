import { getSesVerificationAttributes } from 'app/serverActions/aws/ses/ses'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = (await request.json()) as string

  const result = await getSesVerificationAttributes(data)
  return NextResponse.json(result)
}
