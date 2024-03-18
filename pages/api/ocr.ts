import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { getTextFromImage } from 'lib/backend/api/aws/apiGateway/apiGateway'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req)
  if (!user) {
    return res.status(403).json({ message: 'unauthorized' })
  }
  const url = String(req.query['url'])
  const text = await getTextFromImage(url)
  return res.status(200).json(text)
}
