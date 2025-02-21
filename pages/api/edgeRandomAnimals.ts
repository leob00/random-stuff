import { getItem } from 'app/serverActions/aws/dynamo/dynamo'
import { BasicArticle, DynamoKeys } from 'lib/backend/api/aws/models/apiGatewayModels'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query['id']
  const arg = id as DynamoKeys
  const resp = await getItem(arg)
  const result = JSON.parse(resp.data) as BasicArticle[]
  res.status(200).json(result)
}
