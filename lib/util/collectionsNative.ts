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
