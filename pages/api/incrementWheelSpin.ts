import { getWheelSpinStats, putWheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { RouletteNumber } from 'lib/backend/roulette/wheel'
import { isEven, isOdd } from 'lib/util/numberUtil'
import { NextRequest, NextResponse } from 'next/server'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  let body = (await req.json()) as RouletteNumber
  let spinStats = await getWheelSpinStats()

  if (spinStats) {
    switch (body.color) {
      case 'black':
        spinStats.black += 1
        break
      case 'red':
        spinStats.red += 1
        break
      case 'zero':
        spinStats.zero += 1
        break
      case 'doubleZero':
        spinStats.doubleZero += 1
        break
    }
    if (body.color !== 'zero' && body.color !== 'doubleZero') {
      if (isEven(parseInt(body.value))) {
        spinStats.even += 1
      }
      if (isOdd(parseInt(body.value))) {
        spinStats.odd += 1
      }
    }
    spinStats.total = spinStats.red + spinStats.black + spinStats.zero + spinStats.doubleZero
    await putWheelSpinStats(spinStats)
  } else {
    await putWheelSpinStats({
      black: 0,
      red: 0,
      zero: 0,
      doubleZero: 0,
      odd: 0,
      even: 0,
      total: 0,
    })
  }

  return NextResponse.json(spinStats)
}
