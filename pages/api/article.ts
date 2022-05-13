import type { NextApiRequest, NextApiResponse } from 'next'
import type { DrupalArticle, YieldCurveData } from 'lib/model'
import { getYieldCurveData } from 'lib/repo'
import { DrupalNode } from 'next-drupal'
import { getArticle, getDrupalArticle } from 'lib/drupalApi'

export default async function handler(req: NextApiRequest, res: NextApiResponse<DrupalArticle>) {
  let id = req.query['id'] as string
  var data = await getDrupalArticle(id)
  res.status(200).json(data)
}
