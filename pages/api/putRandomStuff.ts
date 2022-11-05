import type { NextApiRequest, NextApiResponse } from 'next'
import { putRandomStuffEnc } from 'lib/backend/api/aws/apiGateway'
import { EncPutRequest } from 'lib/backend/csr/nextApiWrapper'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  //console.log('url: ', req.url)
  const enc = req.body as EncPutRequest
  const body = await putRandomStuffEnc(enc)
  if (!body) {
    res.status(403).send('validation failed')
    return
  }
  res.status(200).json(body)
}
