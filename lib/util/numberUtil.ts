export function getRandomInteger(start: number, end: number) {
  return Math.floor(Math.random() * (end - start) + start)
}
export function isOdd(num: number) {
  return num % 2 !== 0
}
export function isEven(num: number) {
  return num % 2 === 0
}

export function calculatePercentInt(variable: number, total: number) {
  if (variable === 0 || total === 0) {
    return 0
  }
  let result = Math.floor((variable * 100) / total)
  return result
}
export function calculatePercent(variable: number, total: number) {
  if (variable === 0 || total === 0) {
    return 0
  }
  let result = Number(((variable * 100) / total).toFixed(3))
  return result
}

export function calculateStockMovePercent(price: number, change: number) {
  if (price === 0 || change === 0) {
    return 0
  }
  const startPrice = change > 0 ? price - change : price + Math.abs(change)
  //let result = Number(((variable * 100) / total).toFixed(3))
  const result = calculatePercent(change, startPrice)

  return result
}
