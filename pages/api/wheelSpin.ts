import type { NextApiRequest, NextApiResponse } from 'next'
import { getWheelSpinStats, putWheelSpinStats, WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { RouletteNumber } from 'lib/backend/roulette/wheel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<WheelSpinStats | null>) {
  let dbResult = await getWheelSpinStats()
  res.status(200).json(dbResult)
}
