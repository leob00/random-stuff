import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { buildStockAlertsForAllUsers } from 'lib/backend/alerts/stockAlertBulder'
import { EmailMessage } from 'lib/backend/api/aws/models/apiGatewayModels'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('/api/cron/stockAlerts - unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }
  let emailMessages: EmailMessage[] = []
  try {
    emailMessages = await buildStockAlertsForAllUsers(true)
    for (const email of emailMessages) {
      await sendEmail(email)
    }
  } catch (err) {
    console.error(`/api/cron/stockAlerts error: ${JSON.stringify(err)}`)
    NextResponse.json({ status: 'failed' })
  }

  return NextResponse.json({ status: 'success', messagesSent: emailMessages.length })
}
