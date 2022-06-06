import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllBlogs as getBogCollection } from 'lib/contenfulApi'
import { BlogCollection } from 'lib/models/cms/contentful/blog'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BlogCollection>) {
  var data = await getBogCollection()
  res.status(200).json(data)
}
