import { getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let id = req.query['id'] as string
  let providedToken = req.query['token'] as string | undefined
  if (!providedToken) {
    res.status(403).send('unuathorized call')
    console.log('unauthorized call')
    return
  }
  // const token = myEncrypt(`${id}${getRandomLoaderText()}`, 'what a wonderful world')
  if (process.env.NEXT_PUBLIC_API_TOKEN !== providedToken) {
    res.status(403).send('unuathorized call')
    console.log('unauthorized call')
    return
  }
  console.log('public token:   ', process.env.NEXT_PUBLIC_API_TOKEN)
  //console.log('provided token: ', providedToken)

  var result = await getRandomStuff(id)
  res.status(200).json(result)
}
