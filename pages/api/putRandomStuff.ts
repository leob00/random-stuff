import type { NextApiRequest, NextApiResponse } from 'next'
import { LambdaDynamoRequest, putRandomStuff } from 'lib/backend/api/aws/apiGateway'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let body = req.body as LambdaDynamoRequest
  await putRandomStuff(body.id, body.category, body.data, body.expiration)
  res.status(200).json(body)
}
