import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { getTextFromImage } from 'lib/backend/api/fileApi'
export const config = {
  maxDuration: 15,
  api: {
    responseLimit: false,
  },
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req, res)
  if (!user) {
    return res.status(403).json({ message: 'unauthorized' })
  }
  const url = String(req.query['url'])
  const result = await getTextFromImage(url)
  return res.status(200).json(result.text)
}
