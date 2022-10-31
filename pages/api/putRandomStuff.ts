import type { NextApiRequest, NextApiResponse } from 'next'
import { LambdaDynamoRequest, putRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { authorizeRequest } from 'lib/backend/server-side/requestProcessor'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const isAuthorized = await authorizeRequest(req)
  if (!isAuthorized) {
    res.status(403).send('unuathorized call')
    console.log('unauthorized call')
    return
  }
  let body = req.body as LambdaDynamoRequest

  await putRandomStuff(body.id, body.category, body.data, body.expiration)
  res.status(200).json(body)
}
