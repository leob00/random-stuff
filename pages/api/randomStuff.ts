import { getAnimals, getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { BasicArticle } from 'lib/model'
import { shuffle } from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let id = req.query['id'] as string
  //console.log('getting random stuff: ', id)
  var result = await getRandomStuff(id)
  res.status(200).json(result)
}
