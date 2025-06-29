import { extractBracketValues } from '../stringUtil'

describe('stringUtil Tests', () => {
  test('extractBracketValues', () => {
    const result = extractBracketValues('something[toyota][honda]')
    expect(result.length).toBe(2)
    expect(result[0]).toBe('toyota')
    expect(result[1]).toBe('honda')
  })
})
