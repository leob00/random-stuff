import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { getTextFromImage } from 'lib/backend/api/aws/apiGateway/apiGateway'
import fs from 'fs'
import https from 'https'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req)
  if (!user) {
    return res.status(403).json({ message: 'unauthorized' })
  }
  const url = req.query['url'] as string
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const data = Buffer.from(buffer)
  const base64 = data.toString('base64')

  //convert back: const myBuffer = Buffer.from(someBase64String, 'base64');
  if (response.status !== 200) {
    return res.status(200).json(null)
  }

  return res.status(200).json(base64)
}
