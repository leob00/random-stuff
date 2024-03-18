import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { EmailMessage } from 'lib/backend/api/aws/models/apiGatewayModels'
import { sendEmail } from 'lib/backend/api/aws/apiGateway/apiGateway'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req)
  if (user) {
    const json = req.body as EmailMessage
    const response = await sendEmail(json)
    return res.json({ status: 200, message: response })
  }
  return res.json({ status: 401, message: 'unauthorized' })
}
