import type { NextApiRequest, NextApiResponse } from 'next'
import { LambdaDynamoRequest, putRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let body = req.body as LambdaDynamoRequest
  const id = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), body.token)
  if (body.id !== id) {
    console.log('token validation failed')
    res.status(403).send('token validation failed')
    return
  }
  //logger('token validation passed')
  await putRandomStuff(body.id, body.category, body.data, body.expiration)
  res.status(200).json(body)
}
