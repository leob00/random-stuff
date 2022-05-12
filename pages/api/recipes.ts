import type { NextApiRequest, NextApiResponse } from 'next'
import { DrupalNode } from 'next-drupal'
import { getRecipes } from 'lib/drupalApi'

export default async function handler(req: NextApiRequest, res: NextApiResponse<DrupalNode[]>) {
  let id = req.query['id'] as string
  var data = await getRecipes()
  res.status(200).json(data)
}
