import { BasicArticle } from 'lib/model'
import { DogResponse, getRandomDog } from 'lib/yieldCurveRepo'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BasicArticle>) {
  var data = await getRandomDog()
  //console.log(data)

  res.status(200).json(data)
}
