import { getAnimals } from 'lib/backend/api/apiGateway'
import { BasicArticle } from 'lib/model'
import { shuffle } from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BasicArticle[]>) {
  var result = await getAnimals('dogs')
  const shuffled = shuffle(result)
  res.status(200).json(shuffled)
}
