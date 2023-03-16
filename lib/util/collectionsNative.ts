export function shuffleArray<T>(array: T[]) {
  type WithIndex = {
    item: T
    index: number
  }

  const result: WithIndex[] = []
  array.forEach((item) => {
    result.push({
      index: Math.floor(Math.random() * array.length - 1),
      item: item,
    })
  })
  result.sort((a, b) => a.index - b.index)
  return result.map((item) => item.item)
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
