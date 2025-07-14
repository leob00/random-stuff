import { getPagedArray, getPagedItems, replaceItemInArray } from '../collections'

describe('getPagedItems Tests', () => {
  test('getPagedItems', () => {
    const items = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' },
      { id: 3, name: 'test3' },
    ]
    const result = getPagedItems(items, 1)
    expect(result.pages.length).toBe(3)
  })
  test('getPagedArray', () => {
    const items = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' },
      { id: 3, name: 'test3' },
    ]
    const result = getPagedArray(items, 1)
    expect(result.length).toBe(3)
  })
  test('replaceItemInArray', () => {
    const items = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' },
      { id: 3, name: 'test3' },
    ]
    const replacedItem = { ...items[0], id: 4 }
    replaceItemInArray(replacedItem, items, 'id', 1)
    expect(items[0].id).toBe(4)
  })
})
