import type { NextApiRequest, NextApiResponse } from 'next'
import type { YieldCurveData } from 'lib/model'
import { getYieldCurveData } from 'lib/yieldCurveRepo'

export default async function handler(req: NextApiRequest, res: NextApiResponse<YieldCurveData>) {
  var data = await getYieldCurveData()
  res.status(200).json(data)
}
