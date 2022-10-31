import { getAnimals, getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { BasicArticle } from 'lib/model'
import { findLast, shuffle } from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let id = req.query['id'] as string
  if (id.includes('user-profile')) {
    let r = findLast(Object.keys(req.cookies), (e) => {
      return e.includes('CognitoIdentityServiceProvider')
    })
    if (!r) {
      res.status(403).send('unuathorized call')
      console.log('unauthorized call')
      return
    }
    //console.log(`${r}`)
  }
  //console.log('getting random stuff: ', id)
  var result = await getRandomStuff(id)
  res.status(200).json(result)
}
