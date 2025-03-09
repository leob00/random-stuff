import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req, res)
  if (!user) {
    return res.status(403).json({ message: 'unauthorized' })
  }

  // if (req.method === 'GET') {
  //   const response = await getSesAttributes(user.email)
  //   return res.status(200).json(response)
  // }

  return res.status(200).json({ error: `unrecognized method: ${req.method}` })
}
