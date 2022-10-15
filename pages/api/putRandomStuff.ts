import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllBlogs as getBogCollection } from 'lib/backend/api/contenfulApi'
import { BlogCollection } from 'lib/models/cms/contentful/blog'
import { CoinFlipStats, LambdaDynamoRequest, putRandomStuff, UserProfile } from 'lib/backend/api/aws/apiGateway'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let body = req.body as LambdaDynamoRequest
  await putRandomStuff(body.id, body.category, body.data)
  res.status(200).json(body)
}
