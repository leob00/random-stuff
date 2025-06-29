import { getDateRangeForQuarter } from '../dateUtil'

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
})
