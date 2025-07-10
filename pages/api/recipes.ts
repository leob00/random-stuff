import { getAllRecipes } from 'lib/backend/api/cms/contenfulApi'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await getAllRecipes()
  return res.status(200).json(data)
}
