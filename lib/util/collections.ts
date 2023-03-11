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

export function getListFromMap<T>(map: Map<string | number, T>): T[] {
  const result: T[] = []
  map.forEach((value) => {
    result.push(value)
  })
  return result
}
export function getMapFromArray<T>(array: T[], key: keyof T) {
  let map = new Map<any, T>()
  array.forEach((item, i) => {
    map.set(item[key], item)
  })
  return map
}

export function shuffleArray<T>(array: T[]) {
  // const randomNumbers = new Set([ array.map(() => {
  //     return Math.floor(Math.random() * array.length - 1)}])

  //const map = new Map<number, T>()

  type WithIndex = {
    item: T
    index: number
  }
  const randomNumbers = array.map((o) => {
    return Math.floor(Math.random() * array.length - 1)
  })
  const result: WithIndex[] = []
  array.forEach((item) => {
    result.push({
      index: Math.floor(Math.random() * array.length - 1),
      item: item,
    })
  })
  result.sort((a, b) => a.index - b.index)
  // randomNumbers.forEach((num) => {
  //   const item = {...array[num]}

  //   //result.push(array.slice(num, 1)[0])
  // })
  return result.map((item) => item.item)

  // array.forEach((o, i)=> {
  //  array.splice(randomNumbers[i], )
  // })
  /*  const map = new Map<number, T>()
  for (let num of randomNumbers.values()) {
    map.set(num, array[num])
  }
  const result = getListFromMap(map) as T[]
  return result */
}
