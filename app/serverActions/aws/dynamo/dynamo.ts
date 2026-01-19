import { DynamoDBClient, GetItemCommand, QueryCommand, PutItemCommand, PutItemCommandInput, DeleteItemCommand, DeleteItemInput } from '@aws-sdk/client-dynamodb'
import { awsCreds } from 'app/api/aws/awsHelper'
import { DynamoKeys } from 'lib/backend/api/aws/models/apiGatewayModels'

export type RandomStuffDynamoItem = {
  count?: number
  key: string
  category?: string
  data: any
  last_modified?: string
  expiration?: number
  format?: 'json' | 'string'
  token?: string
}

const db = new DynamoDBClient({
  region: 'us-east-1',
  credentials: awsCreds,
})

export async function getItem(key: DynamoKeys) {
  const emptyResult: RandomStuffDynamoItem = {
    key: key,
    data: '',
  }
  const params = {
    Key: {
      key: {
        S: key,
      },
    },
    TableName: 'randomStuff',
  }

  const command = new GetItemCommand(params)
  try {
    const response = await db.send(command)
    if (response.Item) {
      const item = response.Item
      const result: RandomStuffDynamoItem = {
        data: item['data'].S!,
        category: item['category'].S,
        count: Number(item['count'].N),
        expiration: Number(item['expiration'].N),
        key: item['key'].S!,
        last_modified: item['last_modified'].S,
      }
      return result
    }
  } catch (err) {
    console.error(`unable to get dynamo item by key: ${key}`)
    return emptyResult
  }

  return emptyResult
}
export async function getItemData<T>(key: string) {
  const item = await getItem(key)
  if (item.data) {
    return JSON.parse(item.data) as T
  }
  return null
}

export async function searchItems(category: string) {
  const params = {
    TableName: 'randomStuff',
    IndexName: 'category-index',
    KeyConditionExpression: '#key = :value',
    ExpressionAttributeNames: {
      '#key': 'category',
    },
    ExpressionAttributeValues: {
      ':value': { S: category },
    },
  }

  const command = new QueryCommand(params)
  const response = await db.send(command)
  if (response.Items) {
    const items = response.Items!
    const result: RandomStuffDynamoItem[] = items.map((item) => {
      return {
        key: item['key'].S!,
        category: item['category'].S,
        data: item['data'].S!,
        count: Number(item['count'].N),
        expiration: Number(item['expiration'].N),
        last_modified: item['last_modified'].S,
      }
    })

    return result
  }
  return []
}

export async function putItem(item: RandomStuffDynamoItem) {
  const params: PutItemCommandInput = {
    TableName: 'randomStuff',
    Item: {
      key: {
        S: item.key!,
      },
      category: {
        S: item.category!,
      },
      data: {
        S: !!item.format && item.format === 'string' ? item.data : JSON.stringify(item.data),
      },
      count: {
        N: String(item.count),
      },
      last_modified: {
        S: item.last_modified!,
      },
      expiration: {
        N: String(item.expiration!),
      },
    },
  }
  const command = new PutItemCommand(params)
  const resp = (await db.send(command)).$metadata
  return resp
}
export async function deleteItem(key: string) {
  const params: DeleteItemInput = {
    TableName: 'randomStuff',
    Key: {
      key: {
        S: key,
      },
    },
  }
  const command = new DeleteItemCommand(params)
  const resp = (await db.send(command)).$metadata
  return resp
}
