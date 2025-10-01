import { DropdownItem } from 'lib/models/dropdown'
import { getUtcNow } from 'lib/util/dateUtil'
import { ApiError } from 'next/dist/server/api-utils'
import { UserNote, LambdaDynamoRequest, UserProfile, DynamoKeys, CategoryType, S3Object, Bucket, S3Folder } from '../api/aws/models/apiGatewayModels'

import { constructUserGoalTaksSecondaryKey, constructUserNoteTitlesKey, constructUserProfileKey, constructUserSecretSecondaryKey } from '../api/aws/util'
import { get, post, postBody } from '../api/fetchFunctions'
import { quoteArraySchema, StockQuote, UserSecret } from '../api/models/zModels'
import { weakEncrypt } from '../encryption/useEncryptor'
import { UserGoal, UserTask } from 'components/Organizms/user/goals/goalModels'
import { type RandomStuffDynamoItem } from 'app/serverActions/aws/dynamo/dynamo'
import { EmailMessage } from 'app/serverActions/aws/ses/ses'
import { sortArray } from 'lib/util/collections'
import { StockSavedSearch } from 'components/Organizms/stocks/advanced-search/stocksAdvancedSearch'

export interface SignedRequest {
  appId?: string
  data: string
}

export async function putUserNote(item: UserNote, secondaryKey: string, expiration: number = 0) {
  let req: RandomStuffDynamoItem = {
    key: item.id!,
    category: secondaryKey,
    data: item,
    expiration: expiration,
    token: weakEncrypt(`${item.id}`),
    count: 1,
    format: 'json',
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
}

export async function putSearchedStock(item: StockQuote) {
  const now = getUtcNow()
  const expireDt = now.add(14, 'day')
  const expireSeconds = Math.floor(expireDt.valueOf() / 1000)
  const stock = { ...item, groupName: undefined }
  let req: RandomStuffDynamoItem = {
    key: `searched-stocks[${stock.Symbol}]`,
    category: 'searched-stocks',
    data: stock,
    expiration: expireSeconds,
    token: weakEncrypt(`searched-stocks[${stock.Symbol}]`),
    count: 1,
    format: 'json',
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
}

export async function putUserProfile(item: UserProfile) {
  const cat = 'userProfile'
  item.secKey = undefined

  let req: RandomStuffDynamoItem = {
    key: item.id,
    category: cat,
    data: item,
    expiration: 0,
    token: weakEncrypt(`${item.id}`),
    count: 1,
    format: 'json',
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
}

export async function putUserNoteTitles(username: string, item: UserNote[]) {
  const id = constructUserNoteTitlesKey(username)
  let req: RandomStuffDynamoItem = {
    key: id,
    category: 'user-note-titles',
    data: item,
    expiration: 0,
    token: weakEncrypt(id),
    count: 1,
    format: 'json',
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
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
    const data = await getDynamoItemData<UserProfile>(key)

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
    const resp = await getDynamoItemData<UserNote[]>(key)
    return resp ?? []
  } catch (err) {
    console.error(err)
  }
  return []
}

export async function getUserNote(id: string) {
  let result: UserNote | null = null

  try {
    const data = await getDynamoItemData<UserNote>(id)
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
    const data = await getDynamoItemData<UserGoal[]>(id)
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

export async function getUserGoalTasks(goalId: string) {
  let result: UserTask[] = []

  try {
    const data = await getDynamoItemData<UserTask[]>(goalId)
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
  const req: RandomStuffDynamoItem = {
    key: id,
    category: 'user-goals',
    data: data,
    expiration: expiration,
    token: weakEncrypt(`${id}`),
    count: 1,
    format: 'json',
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  if (navigator.onLine) {
    await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
  }
}
export async function putUserGoalTasks(username: string, goalId: string, data: UserTask[], expiration: number = 0) {
  let req: RandomStuffDynamoItem = {
    key: goalId,
    category: constructUserGoalTaksSecondaryKey(username),
    data: data,
    expiration: expiration,
    token: weakEncrypt(`${goalId}`),
    count: 1,
    format: 'json',
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
}

export async function putUserStockList(username: string, data: StockQuote[]) {
  const id = `user-stock_list[${username}]`
  let req: RandomStuffDynamoItem = {
    key: `user-stock_list[${username}]`,
    category: 'user-stock_list',
    data: data,
    expiration: 0,
    token: weakEncrypt(`${id}`),
    count: 1,
    format: 'json',
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
}

export async function getUserStockList(username: string) {
  try {
    const body = encryptKey(`user-stock_list[${username}]`)
    const data = await post(`/api/aws/dynamo/item`, body)
    if (data) {
      const result = quoteArraySchema.parse(data)
      return result
    }
  } catch (err) {
    console.error(err)
  }
  return []
}

function encryptBody(req: RandomStuffDynamoItem) {
  return weakEncrypt(JSON.stringify(req))
}

export async function putUserSecret(item: UserSecret, username: string, expiration: number = 0) {
  let req: RandomStuffDynamoItem = {
    key: item.id!,
    category: constructUserSecretSecondaryKey(username),
    data: item,
    expiration: expiration,
    token: weakEncrypt(`${item.id}`),
    count: 1,
    format: 'json',
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
}

export async function deleteRecord(id: string) {
  const req: SignedRequest = {
    data: weakEncrypt(id),
  }

  await postBody(`/api/aws/dynamo/item`, 'DELETE', req)
}

export async function getDynamoItemData<T>(id: DynamoKeys): Promise<T> {
  let result: any | null = null
  try {
    const body = encryptKey(id)
    const resp = await postBody('/api/aws/dynamo/item', 'POST', body)
    if (resp.data.length === 0) {
      return null as T
    }
    const data = JSON.parse(resp.data) as T
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
export async function getDynamoItem(id: DynamoKeys) {
  let result: RandomStuffDynamoItem | null = null
  try {
    const body = encryptKey(id)
    const resp = await postBody('/api/aws/dynamo/item', 'POST', body)

    result = resp.data as RandomStuffDynamoItem
    return result
  } catch (err) {
    console.error(err)
    return result
  }
}
export async function searchDynamoItemsByCategory(id: DynamoKeys | CategoryType) {
  const enc = weakEncrypt(id)
  const body: SignedRequest = {
    data: enc,
  }
  const result = (await postBody('/api/aws/dynamo/items', 'POST', body)) as RandomStuffDynamoItem[]
  return result
}
export async function searchDynamoItemsDataByCategory<T>(id: CategoryType): Promise<T[]> {
  const enc = weakEncrypt(id)
  const body: SignedRequest = {
    data: enc,
  }
  const dbResult = (await postBody('/api/aws/dynamo/items', 'POST', body)) as RandomStuffDynamoItem[]

  const results: T[] = []
  dbResult.forEach((m) => {
    results.push(JSON.parse(m.data) as T)
  })
  return results
}

export async function putRecord(id: string | DynamoKeys, category: string, item: any, format: 'json' | 'string' = 'json') {
  let req: RandomStuffDynamoItem = {
    key: id,
    category: category,
    data: item,
    token: weakEncrypt(`${id}`),
    expiration: 0,
    format: format,
    count: Array.isArray(item) ? Array.from(item).length : 1,
    last_modified: getUtcNow().format(),
  }
  const putRequest: SignedRequest = {
    data: encryptBody(req),
  }
  await postBody(`/api/aws/dynamo/item`, 'PUT', putRequest)
}

export async function deleteRecordsBatch(items: string[]) {
  const putRequest: SignedRequest = {
    data: weakEncrypt(JSON.stringify(items)),
  }
  await post(`/api/deleteRandomStuffBatch`, putRequest)
}

export async function sendEmailFromClient(item: EmailMessage) {
  await postBody(`/api/aws/ses/sendEmail`, 'POST', item)
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
  const folder: S3Folder = {
    bucket: bucketName,
    prefix: prefix,
  }
  const signedRequest: SignedRequest = {
    data: weakEncrypt(JSON.stringify(folder)),
  }

  const response = await postBody('/api/aws/s3/items', 'POST', signedRequest)
  const result = response as S3Key[]
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

export async function getPresignedUrl(item: S3Object) {
  const url = (await postBody(`/api/aws/s3/item/presign`, 'POST', item)) as string
  return url
}

export async function ocrImage(url: string) {
  const params = { url: url }
  const resp = await get(`/api/ocr`, params)
  console.log(resp)
  const result = resp as Tesseract.Page
  return result
}

export async function putRandomStuffBatch(data: RandomStuffDynamoItem[]) {
  const url = `/api/aws/dynamo/items/putBatch`

  const signedRequest: SignedRequest = {
    data: weakEncrypt(JSON.stringify(data)),
  }

  try {
    await postBody(url, 'POST', signedRequest)
  } catch (error) {
    console.error('error in putRandomStuff')
    return null
  }
}

export async function getSavedStockSearches(userProfile: UserProfile) {
  if (!userProfile) {
    return []
  }
  const resp = await searchDynamoItemsByCategory(`stock-saved-search[${userProfile.username}]`)
  const sorted = sortArray(resp, ['last_modified'], ['desc'])
  const result = sorted.map((m) => {
    return JSON.parse(m.data) as StockSavedSearch
  })
  return result
}

export async function serverWeakEncrypt(val: string) {
  const result = (await postBody('/api/app/encrypt', 'POST', val)) as string
  return result
}
export async function serverWeakDecrypt(val: string) {
  const result = (await postBody('/api/app/decrypt', 'POST', val)) as string
  return result
}

export async function getUserSecrets() {
  const result = (await postBody('/api/aws/user/secrets/items', 'POST', {})) as UserSecret[]
  return result
}

export async function validateUserPin(pin: string) {
  const result = await postBody('/api/user/pin/validate', 'POST', pin)
  return result
}

export async function decryptUserSecret(secret: UserSecret) {
  const result = (await postBody('/api/aws/user/secrets/items', 'POST', {})) as UserSecret
  console.log('result: ', result)
  return result
}
