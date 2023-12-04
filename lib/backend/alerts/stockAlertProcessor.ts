import dayjs from 'dayjs'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage, StockAlertTrigger, StockQuote } from '../api/models/zModels'

export function processAlertTriggers(subscription: StockAlertSubscriptionWithMessage, quotes: StockQuote[]): StockAlertSubscriptionWithMessage {
  const userSub = { ...subscription }
  const subs = userSub.subscriptions
  const quoteMap = getMapFromArray<StockQuote>(quotes, 'Symbol')
  subs.forEach((sub) => {
    sub.triggers.forEach((trigger) => {
      if (trigger.enabled) {
        switch (trigger.typeId) {
          case 'dailyPercentMove':
            if (quoteMap.has(trigger.symbol)) {
              processDailyMoveTrigger(trigger, quoteMap.get(trigger.symbol)!)
            }
            break
        }
      }
    })
  })
  return userSub
}
function processDailyMoveTrigger(trigger: StockAlertTrigger, quote: StockQuote) {
  trigger.status = 'queued'
  if (Number(trigger.target) <= Math.abs(quote.ChangePercent)) {
    trigger.executedDate = quote.TradeDate
    trigger.lastExecutedDate = quote.TradeDate
    trigger.status = 'complete'
    trigger.actual = quote.ChangePercent
    trigger.message = `${dayjs(quote.TradeDate).format('MM/DD/YYYY hh:mm a')} - target: ${trigger.target}% actual: ${quote.ChangePercent}% `
  }
}
