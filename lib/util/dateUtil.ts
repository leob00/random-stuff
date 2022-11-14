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
