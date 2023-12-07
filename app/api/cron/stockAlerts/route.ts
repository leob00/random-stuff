import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { NextRequest, NextResponse } from 'next/server'
import {
  DynamoKeys,
  EmailMessage,
  getRandomStuff,
  LambdaDynamoRequest,
  putRandomStuffBatch,
  searchRandomStuffBySecIndex,
  sendEmail,
  UserProfile,
} from 'lib/backend/api/aws/apiGateway'
import { constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { processAlertTriggers } from 'lib/backend/alerts/stockAlertProcessor'

export async function GET(req: NextRequest) {
  const updateSubscriptions = async (items: StockAlertSubscription[], searchKey: string) => {
    const records: LambdaDynamoRequest[] = items.map((m) => {
      return {
        id: m.id,
        category: searchKey,
        data: m,
        expiration: 0,
      }
    })

    await putRandomStuffBatch(records)
  }

  const profileResponse = await searchRandomStuffBySecIndex('userProfile')
  const profiles = profileResponse.map((m) => JSON.parse(m.data) as UserProfile)
  const users = profiles.map((m) => m.username)

  const symbols = new Set<string>([])
  const userSubMap = new Map<string, StockAlertSubscriptionWithMessage>()
  for (const username of users) {
    const subResp = await searchRandomStuffBySecIndex(constructStockAlertsSubSecondaryKey(username))
    const subs = subResp.map((m) => JSON.parse(m.data) as StockAlertSubscription)
    if (subs.length > 0) {
      userSubMap.set(username, {
        subscriptions: subs,
      })
      const symbsolsToAdd = subs.map((m) => m.symbol)
      symbsolsToAdd.forEach((symbol) => {
        symbols.add(symbol)
      })
    }
  }
  const quotes = await getStockQuotes(Array.from(symbols.values()))
  const templateKey: DynamoKeys = 'email-template[stock-alert]'
  const template = (await getRandomStuff(templateKey)) as string

  const emailMessages: EmailMessage[] = []

  for (const username of users) {
    const userSub = userSubMap.get(username)
    if (userSub) {
      const resultSub = processAlertTriggers(username, userSub, quotes, template)
      if (resultSub.message) {
        emailMessages.push(resultSub.message)
        resultSub.subscriptions.forEach((s) => {
          s.triggers.forEach((t) => {
            if (t.status === 'started') {
              t.status = 'queued'
            }
          })
        })
      }
      await updateSubscriptions(resultSub.subscriptions, constructStockAlertsSubSecondaryKey(username))
    }
  }
  for (const email of emailMessages) {
    await sendEmail(email)
  }

  return NextResponse.json(emailMessages)
}
