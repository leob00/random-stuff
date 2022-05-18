import type { NextApiRequest, NextApiResponse } from 'next'
import { DrupalNode } from 'next-drupal'
import { getRecipes } from 'lib/drupalApi'
import { ArticlesModel } from 'lib/model'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ArticlesModel>) {
  let id = req.query['id'] as string
  var data = await getRecipes()
  res.status(200).json(data)
}
