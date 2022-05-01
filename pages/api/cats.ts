import { BasicArticle } from 'lib/model'
import { CatResponse, getRandomCat } from 'lib/yieldCurveRepo'
import type { NextApiRequest, NextApiResponse } from 'next'
import RandomCat from 'pages/csr/RandomCat'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BasicArticle>) {
  var data = (await getRandomCat()) as BasicArticle
  res.status(200).json(data)
}
