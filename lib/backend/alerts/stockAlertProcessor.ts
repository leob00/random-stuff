import dayjs from 'dayjs'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { template } from 'lodash'
import { StockAlertSubscription, StockAlertSubscriptionWithMessage, StockAlertTrigger, StockQuote } from '../api/models/zModels'

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

  const userSub = { ...subscription }
  const subs = userSub.subscriptions
  const quoteMap = getMapFromArray<StockQuote>(quotes, 'Symbol')
  subs.forEach((sub) => {
    sub.triggers.forEach((trigger) => {
      if (trigger.enabled) {
        switch (trigger.typeId) {
          case 'dailyPercentMove':
            if (quoteMap.has(trigger.symbol)) {
              processDailyMoveTrigger(sub, trigger, quoteMap.get(trigger.symbol)!, dailyRows)
            }
            break
        }
      }
    })
  })

  if (dailyRows.length > 0) {
    userSub.message = {
      to: username,
      subject: 'Random Stuff - Stock Alerts',
      html: htmlTemplate.replaceAll('{dailyData}', dailyRows.join('')),
    }
  } else {
    htmlTemplate = htmlTemplate.replaceAll('{dailyData}', '')
  }
  console.log('daily rows created: ', dailyRows.length)
  return userSub
}
function processDailyMoveTrigger(sub: StockAlertSubscription, trigger: StockAlertTrigger, quote: StockQuote, dailyRows: string[]) {
  sub.lastTriggerExecuteDate = trigger.lastExecutedDate ?? dayjs(new Date(1900, 1, 1)).format()

  if (trigger.status === 'started') {
    appendDailyRow(quote, dailyRows)
    return
  }
  if (trigger.status !== 'complete') {
    trigger.status = 'queued'
  }
  const lastEx = trigger.lastExecutedDate ? dayjs(trigger.lastExecutedDate).format() : dayjs(new Date(1900, 1, 1)).format()
  const tradeDate = dayjs(quote.TradeDate).format()

  if (lastEx !== tradeDate) {
    if (Number(trigger.target) <= Math.abs(quote.ChangePercent)) {
      const newDate = dayjs(quote.TradeDate).format()
      sub.lastTriggerExecuteDate = newDate
      trigger.executedDate = newDate
      trigger.lastExecutedDate = newDate
      trigger.status = 'started'
      trigger.actual = quote.ChangePercent
      trigger.message = `${dayjs(newDate).format('MM/DD/YYYY hh:mm a')} - target: ${trigger.target}% actual: ${quote.ChangePercent}% `

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

  // const tr = doc.createElement('tr')
  // const td1 = doc.createElement('td')
  // const td2 = doc.createElement('td')
  // td1.append(`${quote.Company} (${quote.Symbol})`)
  // td2.setAttribute('class', quote.ChangePercent < 0 ? 'negative' : 'positive')
  // td2.append(`${quote.ChangePercent}%`)
  // tr.appendChild(td1)
  // tr.appendChild(td2)
  // tableBody.appendChild(tr)
}