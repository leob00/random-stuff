import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteRandomStuff } from 'lib/backend/api/aws/apiGateway'
interface Request {
  key: string
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let body = req.body as Request
  await deleteRandomStuff(body.key)
  res.status(200).json(body)
}
