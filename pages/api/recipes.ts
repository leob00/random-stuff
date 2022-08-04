import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllRecipes } from 'lib/backend/api/contenfulApi'
import { RecipeCollection } from 'lib/models/cms/contentful/recipe'

export default async function handler(req: NextApiRequest, res: NextApiResponse<RecipeCollection>) {
  var data = await getAllRecipes()
  res.status(200).json(data)
}
