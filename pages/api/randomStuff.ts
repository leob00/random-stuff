import { getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { authorizeRequest } from 'lib/backend/server-side/requestProcessor'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let id = req.query['id'] as string
  if (id.includes('user-profile')) {
    const isAuthorized = await authorizeRequest(req)
    if (!isAuthorized) {
      res.status(403).send('unuathorized call')
      console.log('unauthorized call')
      return
    }
    //console.log(`${r}`)
  }
  //console.log('getting random stuff: ', id)
  var result = await getRandomStuff(id)
  res.status(200).json(result)
}
