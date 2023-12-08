import { DynamoKeys, EmailMessage, getRandomStuff, searchRandomStuffBySecIndex, updateSubscriptions, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructStockAlertsSubSecondaryKey } from '../api/aws/util'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage } from '../api/models/zModels'
import { getStockQuotes } from '../api/qln/qlnApi'
import { processAlertTriggers } from './stockAlertProcessor'

export async function buildStockAlertsForAllUsers() {
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
      const newSub = { ...userSub }
      const resultSub = processAlertTriggers(username, newSub, quotes, template)
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
      await updateSubscriptions(resultSub.subscriptions, username)
    }
  }
  return emailMessages
}
