import { chunk, findIndex } from 'lodash'
export interface Page {
  index: number
  items: any[]
}
export interface PagedCollection {
  pages: Page[]
}

export function pageItems(items: any[], pageSize: number) {
  let result: PagedCollection = {
    pages: [],
  }
  let chunks = chunk(items, pageSize)
  chunks.forEach((chunk, index) => {
    result.pages.push({
      index: index + 1,
      items: chunk,
    })
  })
  return result
}

export function getPagedItems<T>(items: T[], pageSize: number) {
  let result: PagedCollection = {
    pages: [],
  }
  const chunks = chunk(items, pageSize)
  chunks.forEach((chunk, index) => {
    result.pages.push({
      index: index + 1,
      items: chunk as T[],
    })
  })
  return result
}

export function replaceItemInArray<T>(T: any, array: T[], key: keyof T, keyVal: string | number) {
  const existingIx = findIndex(array, (e) => {
    return e[key] === keyVal
  })
  if (existingIx > -1) {
    array[existingIx] = T
  }
}
