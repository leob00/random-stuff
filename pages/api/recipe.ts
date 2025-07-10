import { getRecipe } from 'lib/backend/api/cms/contenfulApi'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string
  const data = await getRecipe(id)
  return res.status(200).json(data)
}
