import { DynamoDBClient, BatchWriteItemCommand, BatchWriteItemInput } from '@aws-sdk/client-dynamodb'
import { awsCreds } from 'app/api/aws/awsHelper'
import { RandomStuffDynamoItem } from './dynamo'
import { chunk } from 'lodash'
export async function putItems(items: RandomStuffDynamoItem[]) {
  const db = new DynamoDBClient({
    credentials: awsCreds,
    //region: 'us-east-1',
  })
  const chunks = chunk(items, 25)
  for (const chunk of chunks) {
    const params: BatchWriteItemInput = {
      RequestItems: {
        randomStuff: chunk.map((item) => {
          return {
            PutRequest: {
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
            },
          }
        }),
      },
    }
    const command = new BatchWriteItemCommand(params)
    const resp = (await db.send(command)).$metadata.httpStatusCode
    console.log(`status: ${resp} put ${chunk.length} records`)
  }

  return 'success'
}
