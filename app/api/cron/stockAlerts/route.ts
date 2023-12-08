import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from 'lib/backend/api/aws/apiGateway'
import { buildStockAlertsForAllUsers } from 'lib/backend/alerts/stockAlertBulder'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const emailMessages = await buildStockAlertsForAllUsers()
  for (const email of emailMessages) {
    await sendEmail(email)
  }

  return NextResponse.json({ message: 'cron job completed' })
}
