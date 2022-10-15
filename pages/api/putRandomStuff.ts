import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllBlogs as getBogCollection } from 'lib/backend/api/contenfulApi'
import { BlogCollection } from 'lib/models/cms/contentful/blog'
import { CoinFlipStats, putRandomStuff, UserProfile } from 'lib/backend/api/aws/apiGateway'

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserProfile>) {
  let body = req.body as UserProfile
  await putRandomStuff(body.id, body)
  res.status(200).json(body)
}
