import { BasicArticle } from 'lib/model'
import { CatResponse, getRandomCat } from 'lib/repo'
import type { NextApiRequest, NextApiResponse } from 'next'
import RandomCat from 'pages/csr/RandomCat'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BasicArticle>) {
  var data = (await getRandomCat()) as BasicArticle
  //console.log('loaded api data for cats')
  res.status(200).json(data)
}
