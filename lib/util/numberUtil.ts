export function getRandomInteger(start: number, end: number) {
  return Math.floor(Math.random() * (end - start) + start)
}
export function isOdd(num: number) {
  return num % 2 !== 0
}
export function isEven(num: number) {
  return num % 2 === 0
}
