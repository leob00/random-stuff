import dayjs from 'dayjs'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { StockAlertSubscriptionWithMessage, StockAlertTrigger, StockQuote } from '../api/models/zModels'

export function processAlertTriggers(
  username: string,
  subscription: StockAlertSubscriptionWithMessage,
  quotes: StockQuote[],
  htmlTemplate: string,
): StockAlertSubscriptionWithMessage {
  //const parser = new DOMParser()
  //const doc = parser.parseFromString(htmlTemplate, 'text/html')
  //const tableBody = doc.querySelector('#dailyMoveTable tbody')!
  const dailyRows: string[] = []

  //const userSub = { ...subscription }
  //const subs = userSub.subscriptions
  const quoteMap = getMapFromArray<StockQuote>(quotes, 'Symbol')
  subscription.subscriptions.forEach((sub) => {
    sub.triggers.forEach((trigger) => {
      if (trigger.enabled) {
        switch (trigger.typeId) {
          case 'dailyPercentMove':
            if (quoteMap.has(trigger.symbol)) {
              processDailyMoveTrigger(trigger, quoteMap.get(trigger.symbol)!, dailyRows)
            }
            break
        }
      }
    })
  })

  if (dailyRows.length > 0) {
    subscription.message = {
      to: username,
      subject: 'Random Stuff - Stock Alerts',
      html: htmlTemplate.replaceAll('{dailyData}', dailyRows.join('')),
    }
  } else {
    htmlTemplate = htmlTemplate.replaceAll('{dailyData}', '')
  }
  return { ...subscription, message: subscription.message, subscriptions: subscription.subscriptions }
}
function processDailyMoveTrigger(trigger: StockAlertTrigger, quote: StockQuote, dailyRows: string[]) {
  // sub.lastTriggerExecuteDate = trigger.lastExecutedDate ?? dayjs(new Date(1900, 1, 1)).format('YYYY-MM-DD hh:mm A')

  if (trigger.status === 'started') {
    appendDailyRow(quote, dailyRows)
    return
  }
  if (trigger.status !== 'complete') {
    trigger.status = 'queued'
  }
  const lastEx = trigger.lastExecutedDate ? dayjs(trigger.lastExecutedDate) : dayjs(new Date(1900, 1, 1))
  const tradeDate = dayjs(quote.TradeDate)

  if (tradeDate.isAfter(lastEx)) {
    if (Number(trigger.target) <= Math.abs(quote.ChangePercent)) {
      const newDate = dayjs(tradeDate).format('YYYY-MM-DD hh:mm:ss')
      trigger.executedDate = newDate
      trigger.lastExecutedDate = newDate
      trigger.status = 'started'
      trigger.actual = quote.ChangePercent
      trigger.message = `target: ${trigger.target}% actual: ${quote.ChangePercent}%`
      appendDailyRow(quote, dailyRows)
    }
  }
}

function appendDailyRow(quote: StockQuote, dailyRows: string[]) {
  const tr = '<tr>'
  const td1 = `<td>${quote.Company} (${quote.Symbol})</td>`
  const td2 = `<td class="${quote.ChangePercent < 0 ? 'negative' : 'positive'}">${quote.ChangePercent}</td>`

  const resultRow = `${tr}${td1}${td2}</tr>`
  dailyRows.push(resultRow)
}
