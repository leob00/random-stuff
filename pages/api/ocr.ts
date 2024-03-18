import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { getTextFromImage } from 'lib/backend/api/aws/apiGateway/apiGateway'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req)
  if (!user) {
    return res.status(403).json({ message: 'unauthorized' })
  }
  const url = String(req.query['url'])
  const response = await fetch(url, { method: 'GET' })
  const body = response.body

  const buffer = await response.arrayBuffer()
  const data = Buffer.from(buffer)
  const base64 = data.toString('base64')
  //console.log(`body: ${body}`)
  const text = await getTextFromImage(url)

  //convert back: const myBuffer = Buffer.from(someBase64String, 'base64');
  if (response.status !== 200) {
    return res.status(200).json(null)
  }

  return res.status(200).json(text)
}
