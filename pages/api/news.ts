import type { NextApiRequest, NextApiResponse } from 'next'
import { getNewsBySource, getNewsFeed, NewsItem, NewsTypeIds } from 'lib/backend/api/qln/qlnApi'

export default async function handler(req: NextApiRequest, res: NextApiResponse<NewsItem[]>) {
  let id = req.query['id'] as unknown as NewsTypeIds
  let result = await getNewsBySource(id)
  res.status(200).json(result)
}
