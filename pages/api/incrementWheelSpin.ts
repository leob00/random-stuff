import type { NextApiRequest, NextApiResponse } from 'next'
import { getWheelSpinStats, putWheelSpinStats, WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { RouletteNumber } from 'lib/backend/roulette/wheel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<WheelSpinStats | null>) {
  let body = req.body as RouletteNumber
  let dbResult = await getWheelSpinStats()
  if (dbResult) {
    switch (body.color) {
      case 'black':
        dbResult.black += 1
        break
      case 'red':
        dbResult.red += 1
        break
      case 'green':
        dbResult.green += 1
        break
    }
    await putWheelSpinStats(dbResult)
  } else {
    await putWheelSpinStats({
      black: 0,
      red: 0,
      green: 0,
    })
  }

  res.status(200).json(dbResult)
}