import { UserProfile, DynamoKeys } from '../api/aws/models/apiGatewayModels'
import { constructStockAlertsSubPrimaryKey, constructStockAlertsSubSecondaryKey } from '../api/aws/util'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage } from '../api/models/zModels'
import { getStockQuotes, getStockQuotesServer } from '../api/qln/qlnApi'
import { processAlertTriggers } from './stockAlertProcessor'
import { RandomStuffDynamoItem, getItem, putItems, searchItems } from 'app/serverActions/aws/dynamo/dynamo'
import { EmailMessage } from 'app/serverActions/aws/ses/ses'

async function updateSubscriptions(items: StockAlertSubscription[], username: string) {
  const records: RandomStuffDynamoItem[] = items.map((m) => {
    return {
      id: m.id,
      category: constructStockAlertsSubSecondaryKey(username),
      data: m,
      expiration: 0,
      key: constructStockAlertsSubPrimaryKey(username, m.symbol),
    }
  })
  await putItems(records)
}

export async function buildStockAlertsForAllUsers(userServer: boolean) {
  const profileResponse = await searchItems('userProfile')
  const profiles = profileResponse.map((m) => JSON.parse(m.data) as UserProfile)
  const users = profiles.map((m) => m.username)

  const symbols = new Set<string>([])
  const userSubMap = new Map<string, StockAlertSubscriptionWithMessage>()
  for (const username of users) {
    const subResp = await searchItems(constructStockAlertsSubSecondaryKey(username))
    const subs = subResp.map((m) => JSON.parse(m.data) as StockAlertSubscription)
    if (subs.length > 0) {
      userSubMap.set(username, {
        subscriptions: subs,
      })
      const symbolsToAdd = subs.map((m) => m.symbol)
      symbolsToAdd.forEach((symbol) => {
        symbols.add(symbol)
      })
    }
  }
  const quotes = userServer ? await getStockQuotesServer(Array.from(symbols.values())) : await getStockQuotes(Array.from(symbols.values()))
  const templateKey: DynamoKeys = 'email-template[stock-alert]'
  const templateResp = await getItem(templateKey)
  const template = templateResp.data as string

  const emailMessages: EmailMessage[] = []

  for (const username of users) {
    const userSub = userSubMap.get(username)
    if (userSub) {
      const newSub = { ...userSub }
      const subWithMessage = processAlertTriggers(username, newSub, quotes, template)
      if (subWithMessage.message) {
        emailMessages.push(subWithMessage.message)
      }
      subWithMessage.subscriptions.forEach((s) => {
        s.triggers.forEach((t) => {
          if (t.status === 'started') {
            t.status = 'queued'
          }
        })
      })
      await updateSubscriptions(subWithMessage.subscriptions, username)
    }
  }
  return emailMessages
}
