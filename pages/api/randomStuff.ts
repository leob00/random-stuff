import { getRandomStuff } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { apiConnection } from 'lib/backend/api/config'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const config = apiConnection().internal
  const enc = String(req.query['enc'])
  if (enc.length === 0) {
    console.error('getRandomStuff: invalid enc')
    res.status(403).send('validation failed')
    return
  }
  const id = myDecrypt(config.key, enc)
  var result = await getRandomStuff(id)
  res.status(200).json(result)
}
