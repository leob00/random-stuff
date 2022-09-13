import type { NextApiRequest, NextApiResponse } from 'next'
import { RouletteNumber } from 'lib/backend/roulette/wheel'
import { getNewsFeed, NewsItem } from 'lib/backend/api/qln/qlnApi'

export default async function handler(req: NextApiRequest, res: NextApiResponse<NewsItem[]>) {
  let result = await getNewsFeed()
  res.status(200).json(result)
}
