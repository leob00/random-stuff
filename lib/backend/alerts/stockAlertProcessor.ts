import dayjs from 'dayjs'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage, StockAlertTrigger, StockQuote } from '../api/models/zModels'

export function processAlertTriggers(subscription: StockAlertSubscriptionWithMessage, quotes: StockQuote[], htmlTemplate: string): StockAlertSubscriptionWithMessage {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlTemplate, 'text/html')
  //const tableBody = doc.getElementsByTagName('tbody')[0]
  const tableBody = doc.querySelector('#dailyMoveTable tbody')!

  const userSub = { ...subscription }
  const subs = userSub.subscriptions
  const quoteMap = getMapFromArray<StockQuote>(quotes, 'Symbol')
  subs.forEach((sub) => {
    sub.triggers.forEach((trigger) => {
      if (trigger.enabled) {
        switch (trigger.typeId) {
          case 'dailyPercentMove':
            if (quoteMap.has(trigger.symbol)) {
              processDailyMoveTrigger(sub, trigger, quoteMap.get(trigger.symbol)!, doc, tableBody)
            }
            break
        }
      }
    })
  })
  userSub.message = doc.documentElement.outerHTML
  return userSub
}
function processDailyMoveTrigger(sub: StockAlertSubscription, trigger: StockAlertTrigger, quote: StockQuote, doc: Document, tableBody: Element) {
  trigger.status = 'queued'
  sub.lastTriggerExecuteDate = trigger.lastExecutedDate ?? dayjs(new Date(1900, 1, 1)).format()
  // if (trigger.lastExecutedDate && dayjs(trigger.lastExecutedDate).isSame(dayjs(quote.TradeDate))) {
  //   return
  // }

  if (Number(trigger.target) <= Math.abs(quote.ChangePercent)) {
    const newDate = dayjs(quote.TradeDate).format()
    sub.lastTriggerExecuteDate = newDate
    trigger.executedDate = newDate
    trigger.lastExecutedDate = newDate
    trigger.status = 'complete'
    trigger.actual = quote.ChangePercent
    trigger.message = `${dayjs(newDate).format('MM/DD/YYYY hh:mm a')} - target: ${trigger.target}% actual: ${quote.ChangePercent}% `
    //html message:
    const tr = doc.createElement('tr')
    const td1 = doc.createElement('td')
    const td2 = doc.createElement('td')
    td1.append(`${quote.Company} (${quote.Symbol})`)
    td2.setAttribute('class', quote.ChangePercent < 0 ? 'negative' : 'positive')
    td2.append(`${quote.ChangePercent}%`)
    tr.appendChild(td1)
    tr.appendChild(td2)
    tableBody.appendChild(tr)
  }
}
