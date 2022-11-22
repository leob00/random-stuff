import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
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
