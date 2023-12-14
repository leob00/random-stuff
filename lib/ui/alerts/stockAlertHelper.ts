import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructStockAlertsSubPrimaryKey, constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import { deleteRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'

const dailyMoveTrigger: StockAlertTrigger = {
  enabled: true,
  status: 'queued',
  target: '3.5',
  typeDescription: 'Daily moving average',
  typeInstruction: 'Alert me when the daily moving average exceeds a set value (up/down).',
  typeId: 'dailyPercentMove',
  order: 1,
}
const priceTrigger: StockAlertTrigger = {
  enabled: false,
  status: 'queued',
  target: '',
  typeDescription: 'Price target',
  typeInstruction: 'Alert me when the stock goes above or below a set price.',
  typeId: 'price',
  order: 2,
}

export function getDefaultSubscription(userProfile: UserProfile, quote: StockQuote, data?: StockAlertSubscription | null) {
  const selectedSub = data ?? {
    company: quote.Company,
    id: constructStockAlertsSubPrimaryKey(userProfile.username, quote.Symbol),
    symbol: quote.Symbol,
    triggers: [],
  }
  if (!selectedSub.triggers.find((m) => m.typeId === 'dailyPercentMove')) {
    selectedSub.triggers.push(dailyMoveTrigger)
  }

  selectedSub.triggers = sortArray(selectedSub.triggers, ['order'], ['asc'])
  return selectedSub
}

export async function saveTrigger(username: string, subscriptionId: string, quote: StockQuote, sub: StockAlertSubscription, trigger: StockAlertTrigger) {
  let newTrigger = sub.triggers.find((m) => m.typeId === trigger.typeId)
  if (newTrigger) {
    newTrigger.enabled = trigger.enabled
    newTrigger.target = trigger.target
  } else {
    newTrigger = { ...trigger }
  }

  const newTriggers = sub.triggers.filter((m) => m.typeId !== newTrigger!.typeId)
  newTriggers.push({ ...newTrigger, symbol: quote.Symbol, status: 'queued' })
  sub.triggers = sortArray(newTriggers, ['order'], ['asc'])
  sub.company = quote.Company
  if (sub.triggers.every((m) => !m.enabled)) {
    await deleteRecord(subscriptionId)
  } else {
    await putRecord(sub.id, constructStockAlertsSubSecondaryKey(username), sub)
  }
}

export function sortAlerts(subs: StockAlertSubscription[]) {
  const subsMap = new Map<string, StockAlertSubscription>()
  subs.forEach((sub) => {
    subsMap.set(sub.symbol, sub)
  })
  const allTriggers = subs.flatMap((m) => m.triggers)
  const executedTriggers = sortArray(
    allTriggers.filter((m) => m.message),
    ['lastExecutedDate'],
    ['desc'],
  )
  const nonExecutedTriggers = sortArray(
    allTriggers.filter((m) => !m.executedDate),
    ['lastExecutedDate'],
    ['desc'],
  )

  const result: StockAlertSubscription[] = []
  executedTriggers.forEach((tr) => {
    result.push(subsMap.get(tr.symbol!)!)
  })
  nonExecutedTriggers.forEach((tr) => {
    result.push(subsMap.get(tr.symbol!)!)
  })
  return result
}
