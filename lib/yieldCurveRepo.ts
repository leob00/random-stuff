import type { YieldCurveData } from 'lib/model'

const data: YieldCurveData = {
  rows: [
    { yearsToMaturity: 1, yield: 2.072 },
    { yearsToMaturity: 2, yield: 2.218 },
    { yearsToMaturity: 3, yield: 2.348 },
    { yearsToMaturity: 4, yield: 2.462 },
    { yearsToMaturity: 5, yield: 2.561 },
    { yearsToMaturity: 6, yield: 2.643 },
    { yearsToMaturity: 7, yield: 2.71 },
    { yearsToMaturity: 8, yield: 2.76 },
    { yearsToMaturity: 9, yield: 2.795 },
    { yearsToMaturity: 10, yield: 2.814 },
    { yearsToMaturity: 11, yield: 2.938 },
    { yearsToMaturity: 12, yield: 2.975 },
    { yearsToMaturity: 13, yield: 3.012 },
    { yearsToMaturity: 14, yield: 3.047 },
    { yearsToMaturity: 15, yield: 3.082 },
    { yearsToMaturity: 16, yield: 3.117 },
    { yearsToMaturity: 17, yield: 3.15 },
    { yearsToMaturity: 18, yield: 3.183 },
    { yearsToMaturity: 19, yield: 3.215 },
    { yearsToMaturity: 20, yield: 3.246 },
    { yearsToMaturity: 21, yield: 3.277 },
    { yearsToMaturity: 22, yield: 3.307 },
    { yearsToMaturity: 23, yield: 3.336 },
    { yearsToMaturity: 24, yield: 3.364 },
    { yearsToMaturity: 25, yield: 3.391 },
    { yearsToMaturity: 26, yield: 3.418 },
    { yearsToMaturity: 27, yield: 3.444 },
    { yearsToMaturity: 28, yield: 3.47 },
    { yearsToMaturity: 29, yield: 3.494 },
    { yearsToMaturity: 30, yield: 3.518 },
  ],
}

export async function getYieldCurveData() {
  return data
}
interface DogData {
  message: string
}
export async function getRandomDog() {
  debugger
  let resp = await fetch(`https://dog.ceo/api/breeds/image/random`)
  let data = (await resp.json()) as DogData
  return data.message
}
