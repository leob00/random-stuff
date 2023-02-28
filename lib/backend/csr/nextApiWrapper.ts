import dayjs from 'dayjs'
import { UserNote } from 'lib/models/randomStuffModels'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import { filter } from 'lodash'
import { ApiError } from 'next/dist/server/api-utils'
import { LambdaBody, LambdaDynamoRequest, UserProfile } from '../api/aws/apiGateway'
import { axiosGet, axiosPut } from '../api/aws/useAxios'
import { constructUserGoalTaksSecondaryKey, constructUserNoteCategoryKey, constructUserProfileKey, constructUserSecretSecondaryKey } from '../api/aws/util'
import { quoteArraySchema, StockQuote } from '../api/models/zModels'
import { myEncrypt } from '../encryption/useEncryptor'

export interface EncPutRequest {
  data: string
}

export async function putUserNote(item: UserNote, secondaryKey: string, expiration: number = 0) {
  let req: LambdaDynamoRequest = {
    id: item.id!,
    category: secondaryKey,
    data: item,
    expiration: expiration,
    token: myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `${item.id}`),
    //token: signLambdaDynamoPut(item.id!, secondaryKey, String(process.env.NEXT_PUBLIC_API_TOKEN)),
  }
  const putRequest: EncPutRequest = {
    data: encryptBody(req),
  }
  await axiosPut(`/api/putRandomStuff`, putRequest)
}
export async function expireUserNote(item: UserNote) {
  const unixNowSeconds = Math.floor(getUtcNow().valueOf() / 1000)
  let req: LambdaDynamoRequest = {
    id: item.id!,
    category: 'expired',
    data: item,
    expiration: unixNowSeconds,
    token: myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `${item.id}`),
  }
  const putRequest: EncPutRequest = {
    data: encryptBody(req),
  }
  await axiosPut(`/api/putRandomStuff`, putRequest)
}
export async function deleteUserNote(item: UserNote) {
  let req = {
    key: item.id,
  }
  await axiosPut(`/api/deleteRandomStuff`, req)
}

export async function putUserProfile(item: UserProfile) {
  const cat = 'userProfile'
  let req: LambdaDynamoRequest = {
    id: item.id,
    category: cat,
    data: item,
    expiration: 0,
    token: myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `${item.id}`),
  }
  const putRequest: EncPutRequest = {
    data: encryptBody(req),
  }
  await axiosPut(`/api/putRandomStuff`, putRequest)
}
// todo: this neeeds to be secured
export async function getUserNotes(username: string) {
  let categoryKey = constructUserNoteCategoryKey(username)
  let response = (await axiosGet(`/api/searchRandomStuff?id=${categoryKey}`)) as LambdaBody[]
  let notes: UserNote[] = response.map((item) => JSON.parse(item.data))
  return notes
}

export async function getUserProfile(username: string) {
  let result: UserProfile | null = null
  const key = constructUserProfileKey(username)

  try {
    const body = encryptKey(key)
    const data = await axiosPut(`/api/getRandomStuffEnc`, body)

    if (data) {
      let parsed = data as UserProfile
      if (parsed) {
        parsed.noteTitles = filter(parsed.noteTitles, (e) => {
          return !e.expirationDate || dayjs(e.expirationDate).isAfter(getUtcNow())
        })
        return parsed
      } else {
        const err: ApiError = {
          statusCode: 500,
          name: 'failed to parse user profile',
          message: `${JSON.stringify(data)}`,
        }
        return err
      }
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
export async function getUserNote(id: string) {
  let result: UserNote | null = null

  try {
    const body = encryptKey(id)
    const data = await axiosPut(`/api/getRandomStuffEnc`, body)
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
  const enc = myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), key)
  const body: EncPutRequest = {
    data: enc,
  }
  return body
}

export async function getUserGoals(id: string) {
  let result: UserGoal[] = []

  try {
    const body = encryptKey(id)
    const data = await axiosPut(`/api/getRandomStuffEnc`, body)
    if (data) {
      result = data
      return result
    }
  } catch (err) {
    console.log(err)
  }
  return result
}
export async function getUserTasksLambaBody(username: string) {
  const enc = myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `user-goal-tasks[${username}]`)
  const body: EncPutRequest = {
    data: enc,
  }
  const result = (await axiosPut('/api/searchRandomStuff', body)) as LambdaBody[]
  return result
}

export async function getUserTasks(username: string) {
  const enc = myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `user-goal-tasks[${username}]`)
  const body: EncPutRequest = {
    data: enc,
  }
  const result = (await axiosPut('/api/searchRandomStuff', body)) as LambdaBody[]
  const tasks: UserTask[] = []
  result.forEach((g) => {
    const m = JSON.parse(g.data) as unknown as UserTask[]
    //console.log(m)
    tasks.push(...m)
  })
  return tasks
}
export async function getUserGoalTasks(goalId: string) {
  //const id = `user-goal-tasks${goalId}`
  let result: UserTask[] = []

  try {
    const body = encryptKey(goalId)
    const data = await axiosPut(`/api/getRandomStuffEnc`, body)
    //console.log('api random stuff: ', data)
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
    token: myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `${id}`),
    //token: signLambdaDynamoPut(item.id!, secondaryKey, String(process.env.NEXT_PUBLIC_API_TOKEN)),
  }
  const putRequest: EncPutRequest = {
    data: encryptBody(req),
  }
  await axiosPut(`/api/putRandomStuff`, putRequest)
}
export async function putUserGoalTasks(username: string, goalId: string, data: UserTask[], expiration: number = 0) {
  //console.log('goal id ', goalId)
  let req: LambdaDynamoRequest = {
    id: goalId,
    category: constructUserGoalTaksSecondaryKey(username),
    data: data,
    expiration: expiration,
    token: myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `${goalId}`),
    //token: signLambdaDynamoPut(item.id!, secondaryKey, String(process.env.NEXT_PUBLIC_API_TOKEN)),
  }
  const putRequest: EncPutRequest = {
    data: encryptBody(req),
  }
  //console.log(putRequest)
  await axiosPut(`/api/putRandomStuff`, putRequest)
}

export async function putUserStockList(username: string, data: StockQuote[]) {
  const id = `user-stock_list[${username}]`
  let req: LambdaDynamoRequest = {
    id: `user-stock_list[${username}]`,
    category: 'user-stock_list',
    data: data,
    expiration: 0,
    token: myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `${id}`),
    //token: signLambdaDynamoPut(item.id!, secondaryKey, String(process.env.NEXT_PUBLIC_API_TOKEN)),
  }
  const putRequest: EncPutRequest = {
    data: encryptBody(req),
  }
  await axiosPut(`/api/putRandomStuff`, putRequest)
  //console.log('put stock list: ', data.length)
}

export async function getUserStockList(username: string) {
  //const id = `user-goal-tasks${goalId}`
  //let result: UserTask[] = []

  try {
    const body = encryptKey(`user-stock_list[${username}]`)
    const data = await axiosPut(`/api/getRandomStuffEnc`, body)
    //console.log('api random stuff: ', data)
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
  const enc = myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), constructUserSecretSecondaryKey(username))
  const body: EncPutRequest = {
    data: enc,
  }
  const result = (await axiosPut('/api/searchRandomStuff', body)) as LambdaBody[]
  return result
}

function encryptBody(req: LambdaDynamoRequest) {
  return myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), JSON.stringify(req))
}
