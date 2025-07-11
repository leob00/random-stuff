import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { DateRangeFilter } from 'lib/backend/api/qln/qlnApi'
dayjs.extend(utc)

export function getUtcNow() {
  return dayjs().utc()
}

type Quarter = 1 | 2 | 3 | (number & {})

export function getExpirationText(expirationDate: string, precise: boolean = false) {
  const defaultText = 'expires'
  let message = `${defaultText} on ${dayjs(expirationDate).format('MM/DD/YYYY hh:mm A')}`
  const now = getUtcNow()
  const expDt = dayjs(expirationDate)
  if (!precise) {
    if (expDt.isAfter(now)) {
      const dayDiff = expDt.diff(now, 'day')
      const hourDiff = expDt.diff(now, 'hour')
      const minuteDiff = expDt.diff(now, 'minute')

      if (dayDiff > 0) {
        message = `${defaultText} in ${dayDiff} ${dayDiff > 1 ? 'days' : 'day'}`
      } else if (hourDiff > 0) {
        message = `${defaultText} in ${hourDiff} ${hourDiff > 1 ? 'hours' : 'hour'}`
      } else if (minuteDiff > 0) {
        message = `${defaultText} in ${minuteDiff} ${minuteDiff > 1 ? 'minutes' : 'minute'}`
      }
    }
  }
  return message
}

export function getSecondsFromEpoch() {
  const seconds = Math.ceil(dayjs(new Date()).valueOf() / 1000)
  return seconds
}

export function getDateRangeForQuarter(year: number, quarter: Quarter) {
  const result: DateRangeFilter = {
    startDate: dayjs().format(),
    endDate: dayjs().format(),
  }
  // Date months are 0 based!
  switch (quarter) {
    case 1:
      result.startDate = dayjs(new Date(year, 0, 1)).format()
      result.endDate = dayjs(new Date(year, 2, 31)).format()
      break
    case 2:
      result.startDate = dayjs(new Date(year, 3, 1)).format()
      result.endDate = dayjs(new Date(year, 4, 30)).format()
      break
    case 3:
      result.startDate = dayjs(new Date(year, 6, 1)).format()
      result.endDate = dayjs(new Date(year, 8, 30)).format()
      break
    case 4:
      result.startDate = dayjs(new Date(year, 9, 1)).format()
      result.endDate = dayjs(new Date(year, 11, 31)).format()
      break
  }
  return result
}

export function getUnixExpSecondsFromDate(date: string) {
  const seconds = Math.ceil(dayjs(date).valueOf() / 1000)
  return seconds
}

export const getDateOnly = (dateString: string) => {
  return dayjs(dateString).startOf('day')
}
