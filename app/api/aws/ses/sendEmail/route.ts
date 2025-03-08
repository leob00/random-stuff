import { EmailMessage, sendEmail } from 'app/serverActions/aws/ses/ses'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = (await request.json()) as EmailMessage

  const result = await sendEmail(data)
  return NextResponse.json(result)
}
