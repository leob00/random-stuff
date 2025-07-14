import { calculatePercent, calculatePercentInt, calculateStockMovePercent, getFileSizeText, getImageSize, getRandomInteger, isEven, isOdd } from '../numberUtil'

describe('numberUtil Tests', () => {
  test('getRandomInteger', () => {
    const result = getRandomInteger(1, 2)
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(2)
  })
  test('isOdd', () => {
    const result = isOdd(3)
    expect(result).toBe(true)
  })
  test('isEven', () => {
    const result = isEven(2)
    expect(result).toBe(true)
  })
  test('calculatePercentInt', () => {
    const result = calculatePercentInt(24.5, 100)
    expect(result).toBe(24)
  })
  test('calculatePercent - 0', () => {
    const result = calculatePercent(0, 0)
    expect(result).toBe(0)
  })
  test('calculatePercent', () => {
    const result = calculatePercent(24.5, 100)
    expect(result).toBe(24.5)
  })
  test('calculateStockMovePercent - 0', () => {
    const result = calculateStockMovePercent(0, 0)
    expect(result).toBe(0)
  })
  test('calculateStockMovePercent', () => {
    const result = calculateStockMovePercent(50, 5)
    expect(result).toBe(11.111)
  })
  test('getFileSizeText - KB', () => {
    const result = getFileSizeText(5000)
    expect(result).toBe('4.9 KB')
  })
  test('getFileSizeText - MB', () => {
    const result = getFileSizeText(5000000)
    expect(result).toBe('4.8 MB')
  })
  test('getImageSize - 5000', () => {
    const result = getImageSize(5001)
    expect(result?.width).toBe(350)
  })
  test('getImageSize - 50001', () => {
    const result = getImageSize(50001)
    expect(result?.width).toBe(350)
  })
})
