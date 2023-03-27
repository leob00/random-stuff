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
