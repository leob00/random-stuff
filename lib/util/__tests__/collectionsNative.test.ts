import { dedup, getListFromMap, getMapFromArray } from '../collectionsNative'

describe('getListFromMap Tests', () => {
  test('getPagedItems', () => {
    const map = new Map<number, { id: number; name: string }>()
    map.set(1, { id: 1, name: 'test' })
    map.set(2, { id: 2, name: 'test2' })
    map.set(3, { id: 3, name: 'test3' })
    const result = getListFromMap(map)
    expect(result.length).toBe(3)
  })
  test('getMapFromArray', () => {
    const items = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' },
      { id: 3, name: 'test3' },
    ]
    const result = getMapFromArray(items, 'id')
    expect(result.size).toBe(3)
  })
  test('dedup', () => {
    const items = [
      { id: 1, name: 'test' },
      { id: 1, name: 'test2' },
      { id: 3, name: 'test3' },
    ]
    const result = dedup(items, 'id')
    expect(result.length).toBe(2)
    expect(result[0].id).toBe(1)
    expect(result[1].id).toBe(3)
  })
})
