import dayjs from 'dayjs'
import { DropdownItem } from 'lib/models/dropdown'
import { getUtcNow } from 'lib/util/dateUtil'
import { ApiError } from 'next/dist/server/api-utils'
import {
  UserNote,
  LambdaDynamoRequest,
  UserProfile,
  LambdaBody,
  DynamoKeys,
  CategoryType,
  LambdaDynamoRequestBatch,
  EmailMessage,
  S3Object,
  Bucket,
} from '../api/aws/models/apiGatewayModels'

import {
  constructUserGoalTaksSecondaryKey,
  constructUserNoteCategoryKey,
  constructUserNoteTitlesKey,
  constructUserProfileKey,
  constructUserSecretSecondaryKey,
} from '../api/aws/util'
import { get, post, postBody } from '../api/fetchFunctions'
import { quoteArraySchema, StockQuote, UserSecret } from '../api/models/zModels'
import { weakEncrypt } from '../encryption/useEncryptor'
import { UserGoal, UserTask } from 'components/Organizms/user/goals/goalModels'

export interface SignedRequest {
  appId?: string
  data: string
}

export async function putUserNote(item: UserNote, secondaryKey: string, expiration: number = 0) {
  let req: LambdaDynamoRequest = {
    id: item.id!,
    category: secondaryKey,
    data: item,
    expiration: expiration,
    token: weakEncrypt(`${item.id}`),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}

export async function putSearchedStock(item: StockQuote) {
  const now = getUtcNow()
  const expireDt = now.add(14, 'day')
  const expireSeconds = Math.floor(expireDt.valueOf() / 1000)
  const stock = { ...item, groupName: undefined }
  let req: LambdaDynamoRequest = {
    id: `searched-stocks[${stock.Symbol}]`,
    category: 'searched-stocks',
    data: stock,
    expiration: expireSeconds,
    token: weakEncrypt(`searched-stocks[${stock.Symbol}]`),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}

export async function expireUserNote(item: UserNote) {
  const unixNowSeconds = Math.floor(getUtcNow().valueOf() / 1000)
  let req: LambdaDynamoRequest = {
    id: item.id!,
    category: 'expired',
    data: item,
    expiration: unixNowSeconds,
    token: weakEncrypt(`${item.id}`),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}
export async function deleteUserNote(item: UserNote) {
  let req = {
    key: item.id,
  }
  await post(`/api/deleteRandomStuff`, req)
}

export async function putUserProfile(item: UserProfile) {
  const cat = 'userProfile'
  item.secKey = undefined

  let req: LambdaDynamoRequest = {
    id: item.id,
    category: cat,
    data: item,
    expiration: 0,
    token: weakEncrypt(`${item.id}`),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}

export async function putUserNoteTitles(username: string, item: UserNote[]) {
  const id = constructUserNoteTitlesKey(username)
  let req: LambdaDynamoRequest = {
    id: id,
    category: 'user-note-titles',
    data: item,
    expiration: 0,
    token: weakEncrypt(id),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}

// todo: this neeeds to be secured
export async function getUserNotes(username: string) {
  let categoryKey = constructUserNoteCategoryKey(username)
  let response = (await get(`/api/searchRandomStuff?id=${categoryKey}`)) as LambdaBody[]
  let notes: UserNote[] = response.map((item) => JSON.parse(item.data))
  return notes
}

export const getDefaultFolders = (userProfile: UserProfile) => {
  const folders: DropdownItem[] = [
    {
      text: 'home',
      value: `${userProfile.username}/home`,
    },
    {
      text: 'music',
      value: `${userProfile.username}/music`,
    },
    {
      text: 'notes',
      value: `${userProfile.username}/notes`,
    },

    {
      text: 'pictures',
      value: `${userProfile.username}/pictures`,
    },
  ]
  return folders
}

export async function getUserProfile(username: string) {
  let result: UserProfile | null = null
  const key = constructUserProfileKey(username)

  try {
    const body = encryptKey(key)
    const data = await post(`/api/getRandomStuffEnc`, body)

    if (data) {
      let parsed = data as UserProfile
      if (!parsed.settings) {
        parsed.settings = {
          folders: getDefaultFolders(parsed),
        }
      }
      if (!parsed.settings.folders) {
        parsed.settings.folders = getDefaultFolders(parsed)
      }
      return parsed
    }
  } catch (err) {
    console.error(err)
    const error: ApiError = {
      statusCode: 500,
      name: 'failed to get user profile',
      message: `${JSON.stringify(err)}`,
    }
    return error
  }
  return result
}

export async function getUserNoteTitles(username: string) {
  const key = constructUserNoteTitlesKey(username)

  try {
    const body = encryptKey(key)
    const resp = (await post(`/api/getRandomStuffEnc`, body)) as UserNote[] | null
    return resp ?? []
  } catch (err) {
    console.error(err)
  }
  return []
}

export async function getUserNote(id: string) {
  let result: UserNote | null = null

  try {
    const body = encryptKey(id)
    const data = await post(`/api/getRandomStuffEnc`, body)
    if (data) {
      result = data

      return result
    }
  } catch (err) {
    console.error(err)
  }
  return result
}

function encryptKey(key: string) {
  const enc = weakEncrypt(key)
  const body: SignedRequest = {
    data: enc,
  }
  return body
}

export async function getUserGoals(id: string) {
  let result: UserGoal[] = []

  try {
    const body = encryptKey(id)
    const data = await post(`/api/getRandomStuffEnc`, body)
    if (data) {
      result = data
      return result
    }
  } catch (err) {
    console.error(err)
    throw err
  }
  return result
}
export async function getUserTasksLambaBody(username: string) {
  const enc = weakEncrypt(`user-goal-tasks[${username}]`)
  const body: SignedRequest = {
    data: enc,
  }

  const result = (await post('/api/searchRandomStuff', body)) as LambdaBody[]
  return result
}

export async function getUserTasks(username: string) {
  const enc = weakEncrypt(`user-goal-tasks[${username}]`)
  const body: SignedRequest = {
    data: enc,
  }
  const result = (await post('/api/searchRandomStuff', body)) as LambdaBody[]
  const tasks: UserTask[] = []
  result.forEach((g) => {
    const m = JSON.parse(g.data) as unknown as UserTask[]
    tasks.push(...m)
  })
  return tasks
}
export async function getUserGoalTasks(goalId: string) {
  let result: UserTask[] = []

  try {
    const body = encryptKey(goalId)
    const data = await post(`/api/getRandomStuffEnc`, body)
    if (data) {
      result = data

      return result
    }
  } catch (err) {
    console.error(err)
  }
  return result
}

export async function putUserGoals(id: string, data: UserGoal[], expiration: number = 0) {
  let req: LambdaDynamoRequest = {
    id: id,
    category: 'user-goals',
    data: data,
    expiration: expiration,
    token: weakEncrypt(`${id}`),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}
export async function putUserGoalTasks(username: string, goalId: string, data: UserTask[], expiration: number = 0) {
  let req: LambdaDynamoRequest = {
    id: goalId,
    category: constructUserGoalTaksSecondaryKey(username),
    data: data,
    expiration: expiration,
    token: weakEncrypt(`${goalId}`),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}

export async function putUserStockList(username: string, data: StockQuote[]) {
  const id = `user-stock_list[${username}]`
  let req: LambdaDynamoRequest = {
    id: `user-stock_list[${username}]`,
    category: 'user-stock_list',
    data: data,
    expiration: 0,
    token: weakEncrypt(`${id}`),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}

export async function getUserStockList(username: string) {
  try {
    const body = encryptKey(`user-stock_list[${username}]`)
    const data = await post(`/api/getRandomStuffEnc`, body)
    if (data) {
      const result = quoteArraySchema.parse(data)
      return result
    }
  } catch (err) {
    console.error(err)
  }
  return []
}

// export async function getUserSecrets(username: string) {

//   const enc = weakEncrypt(constructUserSecretSecondaryKey(username))
//   const body: SignedRequest = {
//     data: enc,
//   }
//   const result = (await post('/api/searchRandomStuff', body)) as LambdaBody[]
//   return result
// }

function encryptBody(req: LambdaDynamoRequest) {
  return weakEncrypt(JSON.stringify(req))
}

export async function putUserSecret(item: UserSecret, username: string, expiration: number = 0) {
  let req: LambdaDynamoRequest = {
    id: item.id!,
    category: constructUserSecretSecondaryKey(username),
    data: item,
    expiration: expiration,
    token: weakEncrypt(`${item.id}`),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}

export async function deleteRecord(id: string) {
  let req = {
    key: id,
  }
  await post(`/api/deleteRandomStuff`, req)
}

export async function getRecord<T>(id: DynamoKeys | string): Promise<T> {
  let result: any | null = null
  try {
    const body = encryptKey(id)
    const data = await post(`/api/getRandomStuffEnc`, body)
    if (data) {
      return data as T
    } else {
      return result
    }
  } catch (err) {
    console.error(err)
    return result
  }
}
export async function searchRecords(id: DynamoKeys | CategoryType | string): Promise<LambdaBody[]> {
  const enc = weakEncrypt(id)
  const body: SignedRequest = {
    data: enc,
  }
  const result = (await post('/api/searchRandomStuff', body)) as LambdaBody[]
  return result
}

export async function putRecord(id: DynamoKeys | string, category: string, item: any) {
  let req: LambdaDynamoRequest = {
    id: id,
    category: category,
    data: item,
    token: weakEncrypt(`${id}`),
    expiration: 0,
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await post(`/api/putRandomStuff`, putRequest)
}
export async function putRecordsBatch(batch: LambdaDynamoRequestBatch) {
  const putRequest: SignedRequest = {
    data: weakEncrypt(JSON.stringify(batch)),
  }
  await post(`/api/putRandomStuffBatch`, putRequest)
}
export async function deleteRecordsBatch(items: string[]) {
  const putRequest: SignedRequest = {
    data: weakEncrypt(JSON.stringify(items)),
  }
  await post(`/api/deleteRandomStuffBatch`, putRequest)
}

export async function getCommunityStocks() {
  var result = await getRecord<StockQuote[]>('community-stocks')
  return result
}

export async function sendEmailFromClient(item: EmailMessage) {
  await post(`/api/sendEmail`, item)
}

export async function renameS3File(bucket: string, oldPath: string, newPath: string): Promise<any> {
  return await postBody('/api/s3', 'PATCH', { bucket: bucket, oldPath: oldPath, newPath: newPath })
}

// S3
export interface S3Key {
  key: string
  size: number
}
const buildFilesAndFolders = (items: S3Object[]) => {
  const result: S3Object[] = []
  items.forEach((item) => {
    const isInFolder = item.fullPath.endsWith('/')
    const fileName = !isInFolder ? item.fullPath.substring(item.fullPath.lastIndexOf('/') + 1) : item.fullPath.substring(item.fullPath.lastIndexOf('/'))
    if (!isInFolder) {
      result.push({ ...item, filename: fileName, isFolder: isInFolder })
    }
  })
  return result
}

export async function getS3Files(bucketName: Bucket, prefix: string) {
  const response = await get('/api/s3', { bucket: bucketName, prefix: prefix })
  const result = JSON.parse(response) as S3Key[]
  const files: S3Object[] = result.map((m) => {
    return {
      bucket: bucketName,
      prefix: m.key,
      fullPath: m.key,
      filename: '',
      isFolder: false,
      size: m.size,
    }
  })
  const results = buildFilesAndFolders(files)
  return results
}
export async function getS3File(bucketName: Bucket, prefix: string, fileName: string) {
  const results = await getS3Files(bucketName, prefix)
  const result = results.find((m) => m.filename.toLowerCase() === fileName.toLowerCase())
  return result
}

export async function getPresignedUrl(bucket: Bucket, fullPath: string, expiration: number = 600) {
  const params = { bucket: bucket, fullPath: fullPath, expiration: expiration }
  const url = JSON.parse(await post(`/api/s3`, params)) as string
  return url
}

export async function ocrImage(url: string) {
  const params = { url: url }
  const resp = await get(`/api/ocr`, params)
  console.log(resp)
  const result = resp as Tesseract.Page
  return result
}
