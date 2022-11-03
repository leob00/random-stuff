import { getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { authorizeGetRequest } from 'lib/backend/server-side/requestProcessor'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (!authorizeGetRequest(req)) {
    res.status(403).send('unuathorized call')
    console.log('unauthorized call')
    return
  }

  const id = req.query['id'] as string
  var result = await getRandomStuff(id)
  res.status(200).json(result)
}
