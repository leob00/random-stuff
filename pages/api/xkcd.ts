import { BasicArticle } from 'lib/model'
import { getXkCd, XkCdResponse } from 'lib/repo'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BasicArticle>) {
  var data = (await getXkCd()) as BasicArticle

  res.status(200).json(data)
}
