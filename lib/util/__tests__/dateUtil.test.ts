import dayjs from 'dayjs'
import { convertUtcToUsEasternDateTime, getDateRangeForQuarter, getExpirationText, getUnixExpSecondsFromDate } from '../dateUtil'

describe('dateUtil Tests', () => {
  test('getDateRangeForQuarter - Q1', () => {
    const result = getDateRangeForQuarter(2025, 1)
    expect(result.startDate).toBe('2025-01-01T00:00:00-05:00')
    expect(result.endDate).toBe('2025-03-31T00:00:00-04:00')
  })
  test('getDateRangeForQuarter - Q2', () => {
    const result = getDateRangeForQuarter(2025, 2)
    expect(result.startDate).toBe('2025-04-01T00:00:00-04:00')
    expect(result.endDate).toBe('2025-05-30T00:00:00-04:00')
  })
  test('getDateRangeForQuarter - Q3', () => {
    const result = getDateRangeForQuarter(2025, 3)
    expect(result.startDate).toBe('2025-07-01T00:00:00-04:00')
    expect(result.endDate).toBe('2025-09-30T00:00:00-04:00')
  })
  test('getDateRangeForQuarter - Q4', () => {
    const result = getDateRangeForQuarter(2025, 4)
    expect(result.startDate).toBe('2025-10-01T00:00:00-04:00')
    expect(result.endDate).toBe('2025-12-31T00:00:00-05:00')
  })

  test('getUnixExpSecondsFromDate', () => {
    const dt = dayjs(new Date(2025, 7, 11)).format()
    const result = getUnixExpSecondsFromDate(dt)
    expect(result).toBe(1754884800)
  })

  test('getExpirationText', () => {
    const expDt = dayjs().add(2, 'days').format()
    const result = getExpirationText(expDt)
    expect(result).toBe('expires in 1 day')
  })

  test('getExpirationText - precise', () => {
    const expDt = dayjs(new Date(2025, 7, 10)).format()
    const result = getExpirationText(expDt, true)
    expect(result).toBe('expires on 08/10/2025 12:00 AM')
  })
  test('convert UTC date to US Eastern time', () => {
    const dt = dayjs(new Date(2025, 7, 10, 13, 30)).format() //2025-08-10T13:30:00-04:00
    const result = convertUtcToUsEasternDateTime(dt)
    expect(result).toBe('2025-08-10T09:30:00-04:00')
  })
  test('convert UTC date to US Eastern time', () => {
    const dt = dayjs(new Date(2025, 7, 10, 13, 30)).format() //2025-08-10T13:30:00-04:00
    const result = convertUtcToUsEasternDateTime(dt)
    expect(result).toBe('2025-08-10T09:30:00-04:00')
  })
})
