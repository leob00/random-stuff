import dayjs from 'dayjs'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { orderBy, uniq } from 'lodash'

export const getDefaultDateOption = (data: StockEarning[], todayDate?: string) => {
  const uniqueDates = orderBy(uniq(data.map((m) => m.ReportDate!)))
  const todayEarningsDate = uniqueDates.find((m) => dayjs(m).format('MM/DD/YYYY') === dayjs().format('MM/DD/YYYY')) ?? null

  if (todayDate) {
    return todayDate
  }

  if (uniqueDates.length > 0) {
    const past = uniqueDates.filter((m) => dayjs(m).isBefore(dayjs()))
    if (past.length > 0) {
      return past[past.length - 1]
    }
    return uniqueDates[uniqueDates.length - 1]
  }
  return todayEarningsDate
}
export const filterResult = (items: StockEarning[], dt: string | null) => {
  return orderBy(
    items.filter((m) => m.ReportDate === dt),
    ['StockQuote.Company'],
    ['asc'],
  )
}
