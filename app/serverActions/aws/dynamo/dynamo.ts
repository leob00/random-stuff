import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

export type RandomStuffDynamoItem = {
  count?: number
  key?: string
  category?: string
  data: string
  last_modified?: string
  expiration?: number
}

export async function getItem(key: string) {
  const params = {
    Key: {
      key: {
        S: key,
      },
    },
    TableName: 'randomStuff',
  }
  const db = new DynamoDBClient({
    credentials: {
      accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
      secretAccessKey: String(process.env.AWS_ACCESS_KEY_SECRET),
    },
  })
  const command = new GetItemCommand(params)
  const response = await db.send(command)
  const item = response.Item!
  const result: RandomStuffDynamoItem = {
    data: item['data'].S!,
    category: item['category'].S,
    count: Number(item['count'].N),
    expiration: Number(item['expiration'].N),
    key: item['key'].S,
    last_modified: item['last_modified'].S,
  }
  return result
}
