import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllBlogs as getBogCollection } from 'lib/backend/api/contenfulApi'
import { BlogCollection } from 'lib/models/cms/contentful/blog'
import { CoinFlipStats, putRandomStuff } from 'lib/backend/api/aws/apiGateway'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  //var data = await getBogCollection()
  //console.log(`api result: ${JSON.stringify(data)}`)
  //console.log(JSON.stringify(req.body))
  let body = req.body
  await putRandomStuff('coinflip-community', body)
  //console.log(`api result: ${JSON.stringify(result)}`)
  res.status(200).json(body)
}
