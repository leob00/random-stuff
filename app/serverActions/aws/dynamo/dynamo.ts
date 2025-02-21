import { DynamoDBClient, GetItemCommand, QueryCommand, PutItemCommand, PutItemCommandInput, DeleteItemCommand, DeleteItemInput } from '@aws-sdk/client-dynamodb'
import { awsCreds } from 'app/api/aws/awsHelper'

export type RandomStuffDynamoItem = {
  count?: number
  key: string
  category?: string
  data: any
  last_modified?: string
  expiration?: number
}

export type RandomStuffItemRequest = {
  id: string
  category: string
  data: any
  expiration: number
  token?: string
}

export async function getItem(key: string) {
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
  const db = new DynamoDBClient({
    credentials: awsCreds,

    //region: 'us-east-1',
  })
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
  const db = new DynamoDBClient({
    credentials: awsCreds,
    //region: 'us-east-1',
  })
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
        S: JSON.stringify(item.data),
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
  const db = new DynamoDBClient({
    credentials: awsCreds,
    //region: 'us-east-1',
  })
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
  const db = new DynamoDBClient({
    credentials: awsCreds,
    //region: 'us-east-1',
  })
  const command = new DeleteItemCommand(params)
  const resp = (await db.send(command)).$metadata
  return resp
}
