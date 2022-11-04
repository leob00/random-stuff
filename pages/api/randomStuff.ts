import { getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import { authorizeGetRequest } from 'lib/backend/server-side/requestProcessor'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const enc = String(req.query['enc'])
  if (enc.length === 0) {
    console.log('getRandomStuff: invalid enc')
    res.status(403).send('validation failed')
    return
  }
  const id = myDecrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), enc)
  //console.log('decrypted: ', id)
  var result = await getRandomStuff(id)
  res.status(200).json(result)
}
