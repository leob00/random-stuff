import { LambdaBody, searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<LambdaBody[] | string>) {
  const enc = String(req.query['enc'])
  if (enc.length === 0) {
    console.log('getRandomStuff: invalid enc')
    res.status(403).send('validation failed')
    return
  }
  const id = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), enc)

  const result = await searchRandomStuffBySecIndex(id)
  res.status(200).json(result)
}
