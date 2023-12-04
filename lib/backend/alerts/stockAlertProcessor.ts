import dayjs from 'dayjs'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { StockAlertSubscriptionWithMessage, StockAlertTrigger, StockQuote } from '../api/models/zModels'

export function processAlertTriggers(
  subscription: StockAlertSubscriptionWithMessage,
  quotes: StockQuote[],
  htmlTemplate: string,
): StockAlertSubscriptionWithMessage {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlTemplate, 'text/html')
  const tableBody = doc.getElementsByTagName('tbody')[0]
  const userSub = { ...subscription }
  const subs = userSub.subscriptions
  const quoteMap = getMapFromArray<StockQuote>(quotes, 'Symbol')
  subs.forEach((sub) => {
    sub.triggers.forEach((trigger) => {
      if (trigger.enabled) {
        switch (trigger.typeId) {
          case 'dailyPercentMove':
            if (quoteMap.has(trigger.symbol)) {
              processDailyMoveTrigger(trigger, quoteMap.get(trigger.symbol)!, doc, tableBody)
            }
            break
        }
      }
    })
  })
  userSub.message = doc.documentElement.outerHTML
  return userSub
}
function processDailyMoveTrigger(trigger: StockAlertTrigger, quote: StockQuote, doc: Document, tableBody: HTMLTableSectionElement) {
  trigger.status = 'queued'
  if (Number(trigger.target) <= Math.abs(quote.ChangePercent)) {
    trigger.executedDate = quote.TradeDate
    trigger.lastExecutedDate = quote.TradeDate
    trigger.status = 'complete'
    trigger.actual = quote.ChangePercent
    trigger.message = `${dayjs(quote.TradeDate).format('MM/DD/YYYY hh:mm a')} - target: ${trigger.target}% actual: ${quote.ChangePercent}% `
    //html message:
    const tr = doc.createElement('tr')
    const td1 = doc.createElement('td')
    const td2 = doc.createElement('td')
    const td3 = doc.createElement('td')
    const td4 = doc.createElement('td')
    td1.append(`${quote.Company} (${quote.Symbol})`)
    td2.append(`${quote.Price}`)
    td3.append(`${quote.Change}`)
    td4.append(`${quote.ChangePercent}%`)
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tableBody.appendChild(tr)
  }
}
