import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { DateRangeFilter } from 'lib/backend/api/qln/qlnApi'
dayjs.extend(utc)

export function getUtcNow() {
  return dayjs().utc()
}

export function getExpirateDateFromSeconds(epochSeconds: number) {
  const ticks = dayjs(Math.floor(epochSeconds * 1000))
  const result = dayjs(ticks)
  return result
}

export function getExpirationText(expirationDate: string, precise: boolean = false) {
  const defaultText = 'this record will expire '
  let message = `${defaultText} on ${dayjs(expirationDate).format('MM/DD/YYYY hh:mm a')}`
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

export function getDateRangeForQuarter(year: number, quarter: number) {
  const result: DateRangeFilter = {
    startDate: dayjs().format(),
    endDate: dayjs().format(),
  }
  switch (quarter) {
    case 1:
      result.startDate = dayjs(new Date(year, 0, 1)).format()
      result.endDate = dayjs(new Date(year, 2, 31)).format()
      break
    case 2:
      result.startDate = dayjs(new Date(year, 3, 1)).format()
      result.endDate = dayjs(new Date(year, 5, 30)).format()
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

export function getDateRangeForPreviousQuarter(year: number, quarter: number) {
  const startRange = getDateRangeForQuarter(year, quarter)
  let newStartDate = dayjs(startRange.startDate)
  let newEndDate = dayjs(startRange.endDate)
  let startYear = newStartDate.year()
  let startQ = newStartDate.quarter()
  let endYear = newEndDate.year()
  let endQ = newEndDate.quarter()

  if (startQ === 1) {
    startYear = startYear - 1
    startQ = 4
  } else {
    startQ = startQ - 1
  }

  if (endQ === 1) {
    endYear = endYear - 1
    endQ = 4
  } else {
    endQ = endQ - 1
  }

  const startDt = getDateRangeForQuarter(startYear, startQ).startDate
  const endDt = getDateRangeForQuarter(endYear, endQ).endDate
  const range: DateRangeFilter = {
    startDate: startDt,
    endDate: endDt,
  }
  return range
}
