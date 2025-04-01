import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { EmailMessage, sendEmail } from 'app/serverActions/aws/ses/ses'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, response: NextResponse) {
  const user = await getUserSSRAppRouteApi(request, response)
  if (!user) {
    return new Response(JSON.stringify('unauthorized'), { status: 403 })
  }
  const data = (await request.json()) as EmailMessage

  const result = await sendEmail(data)
  return NextResponse.json(data)
}
