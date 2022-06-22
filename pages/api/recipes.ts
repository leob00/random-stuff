import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllRecipes } from 'lib/contenfulApi'
import { RecipeCollection } from 'lib/models/cms/contentful/recipe'

export default async function handler(req: NextApiRequest, res: NextApiResponse<RecipeCollection>) {
  let id = req.query['id'] as string
  var data = await getAllRecipes()
  res.status(200).json(data)
}
