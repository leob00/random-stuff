import dayjs from 'dayjs'
import { UserNote } from 'lib/models/randomStuffModels'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import { ApiError } from 'next/dist/server/api-utils'
import { CategoryType, DynamoKeys, EmailMessage, LambdaBody, LambdaDynamoRequest, UserProfile } from '../api/aws/apiGateway'
import { constructUserGoalTaksSecondaryKey, constructUserNoteCategoryKey, constructUserNoteTitlesKey, constructUserProfileKey, constructUserSecretSecondaryKey } from '../api/aws/util'
import { get, post } from '../api/fetchFunctions'
import { quoteArraySchema, StockQuote, UserSecret } from '../api/models/zModels'
import { weakEncrypt } from '../encryption/useEncryptor'

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
  const expireDt = now.add(10, 'day')
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

export async function getUserProfile(username: string) {
  let result: UserProfile | null = null
  const key = constructUserProfileKey(username)

  try {
    const body = encryptKey(key)
    const data = await post(`/api/getRandomStuffEnc`, body)

    if (data) {
      let parsed = data as UserProfile
      return parsed
    }
  } catch (err) {
    console.log(err)
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
    const data = (await post(`/api/getRandomStuffEnc`, body)) as UserNote[] | null

    if (data) {
      let parsed = data.filter((e) => {
        return !e.expirationDate || dayjs(e.expirationDate).isAfter(getUtcNow())
      })
      return parsed
    }
  } catch (err) {
    console.log(err)
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
    console.log(err)
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
    console.log(err)
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
    console.log(err)
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
    console.log(err)
  }
  return []
}

export async function getUserSecrets(username: string) {
  const enc = weakEncrypt(constructUserSecretSecondaryKey(username))
  const body: SignedRequest = {
    data: enc,
  }
  const result = (await post('/api/searchRandomStuff', body)) as LambdaBody[]
  return result
}

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

export async function getRecord<T>(id: DynamoKeys): Promise<T> {
  let result: any
  try {
    const body = encryptKey(id)
    const data = await post(`/api/getRandomStuffEnc`, body)
    if (data) {
      result = data
      return result
    }
  } catch (err) {
    console.log(err)
  }
  return result as T
}
export async function searchRecords(id: DynamoKeys | CategoryType): Promise<LambdaBody[]> {
  const enc = weakEncrypt(id)
  const body: SignedRequest = {
    data: enc,
  }
  const result = (await post('/api/searchRandomStuff', body)) as LambdaBody[]
  return result
}

export async function putRecord(id: DynamoKeys, category: string, item: any) {
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

export async function getCommunityStocks() {
  var result = await getRecord<StockQuote[]>('community-stocks')
  return result
}

export async function sendEmailFromClient(item: EmailMessage) {
  await post(`/api/sendEmail`, item)
}
