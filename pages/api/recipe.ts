import type { NextApiRequest, NextApiResponse } from 'next'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { getRecipe } from 'lib/backend/api/contenfulApi'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Recipe>) {
  let id = req.query['id'] as string
  console.log('called api/getRecipe: ' + id)
  var data = await getRecipe(id)
  res.status(200).json(data)
}
