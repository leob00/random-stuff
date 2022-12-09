import { getRandomStuff, LambdaBody, searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { EncPutRequest } from 'lib/backend/csr/nextApiWrapper'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<LambdaBody[] | string>) {
  const enc = req.body as EncPutRequest
  const dec = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), enc.data)
  if (dec.length === 0) {
    res.status(403).send('Validation Failed. Token does not match.')
    return
  }

  const result = await getRandomStuff(dec)
  res.status(200).json(result)
}
