import { getRandomDog } from 'lib/yieldCurveRepo'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  var data = await getRandomDog()
  console.log(data)
  res.status(200).json(data)
}
