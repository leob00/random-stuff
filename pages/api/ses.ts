import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { getSesAttributes, sendSesEmailVerification } from 'lib/backend/api/aws/apiGateway'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req)
  if (!user) {
    return res.status(403).json({ message: 'unauthorized' })
  }
  interface Arg extends S3Object {
    expiration?: number
  }
  if (req.method === 'GET') {
    const response = await getSesAttributes(user.email)
    return res.status(200).json(response)
  }
  if (req.method === 'PUT') {
    const response = await sendSesEmailVerification(user.email)
    return res.status(200).json(response)
  }
  return res.status(200).json({ error: `unrecognized method: ${req.method}` })
}
