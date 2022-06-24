import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllRecipes } from 'lib/contenfulApi'
import { RecipeCollection } from 'lib/models/cms/contentful/recipe'
import { take } from 'lodash'

export default async function handler(req: NextApiRequest, res: NextApiResponse<RecipeCollection>) {
  var data = await getAllRecipes()
  data.topFeatured = take(data.items, 10)
  res.status(200).json(data)
}
