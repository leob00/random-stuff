import { LambdaBody, searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { EncPutRequest } from 'lib/backend/csr/nextApiWrapper'
import { myDecrypt, myDecryptBase64 } from 'lib/backend/encryption/useEncryptor'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<LambdaBody[] | string>) {
  const id = String(req.query['id'])
  const enc = req.body as EncPutRequest
  //console.log('enc: ', enc.data)
  const dec = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), enc.data)
  //console.log('dec: ', dec)
  /* const token = String(req.query['token'])
  if (!token) {
    res.status(403).send('Validation failed.')
    return
  }
  console.log('token: ', token)
  const decryptedToken = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), String(process.env.NEXT_PUBLIC_API_TOKEN))
  console.log('decryptedToken: ', decryptedToken)
  if (decryptedToken !== process.env.NEXT_PUBLIC_API_TOKEN) {
    if (!decryptedToken) {
      res.status(403).send('Validation Failed. Token does not match.')
      return
    }
  } */
  const result = await searchRandomStuffBySecIndex(dec)
  res.status(200).json(result)
}
