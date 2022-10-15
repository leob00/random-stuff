import { LambdaBody, searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<LambdaBody[]>) {
  let id = req.query['id'] as string
  //console.log('searching: ', id)
  var result = await searchRandomStuffBySecIndex(id)
  //console.log(result)
  res.status(200).json(result)
}
