import { extractBracketValues, getWorkflowStatusText, toCamelCase } from '../stringUtil'

describe('stringUtil Tests', () => {
  test('extractBracketValues', () => {
    const result = extractBracketValues('something[toyota][honda]')
    expect(result.length).toBe(2)
    expect(result[0]).toBe('toyota')
    expect(result[1]).toBe('honda')
  })
  test('extractBracketValues no result', () => {
    const result = extractBracketValues('something')
    expect(result.length).toBe(0)
  })
  test('getWorkflowStatusText unknown', () => {
    const result = getWorkflowStatusText(0)
    expect(result).toBe('unknown')
  })

  test('getWorkflowStatusText In Progress', () => {
    const result = getWorkflowStatusText(1)
    expect(result).toBe('In Progress')
  })
  test('getWorkflowStatusText Completed', () => {
    const result = getWorkflowStatusText(2)
    expect(result).toBe('Completed')
  })
  test('getWorkflowStatusText Error', () => {
    const result = getWorkflowStatusText(3)
    expect(result).toBe('Finished with Error')
  })
  test('toCamelCase returns blank', () => {
    const result = toCamelCase()
    expect(result).toBe('')
  })
  test('toCamelCase muti word', () => {
    const result = toCamelCase('hello there')
    expect(result).toBe('Hello There')
  })
})
