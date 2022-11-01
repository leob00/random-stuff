import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { ApiError } from 'next/dist/server/api-utils'
import { LambdaBody, LambdaDynamoRequest, UserProfile } from '../api/aws/apiGateway'
import { axiosGet, axiosPut } from '../api/aws/useAxios'
import { constructUserNoteCategoryKey, constructUserProfileKey } from '../api/aws/util'
import { signLambdaDynamoPut } from '../encryption/useEncryptor'

export async function putUserNote(item: UserNote, secondaryKey: string) {
  let req: LambdaDynamoRequest = {
    id: item.id!,
    category: secondaryKey,
    data: item,
    expiration: 0,
    token: signLambdaDynamoPut(item.id!, secondaryKey, item.id!),
  }
  await axiosPut(`/api/putRandomStuff`, req)
}
export async function expireUserNote(item: UserNote) {
  const unixNowSeconds = getUtcNow().valueOf() / 1000
  let req: LambdaDynamoRequest = {
    id: item.id!,
    category: 'expired',
    data: item,
    expiration: Math.floor(unixNowSeconds),
    token: signLambdaDynamoPut(item.id!, 'expired', item.id!),
  }
  await axiosPut(`/api/putRandomStuff`, req)
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
    token: signLambdaDynamoPut(item.id, cat, item.id),
  }
  await axiosPut(`/api/putRandomStuff`, req)
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
    let data = await axiosGet(`/api/randomStuff?id=${key}`)
    if (data) {
      let parsed = data as UserProfile
      if (parsed) {
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
export async function getUserNote(id?: string) {
  let result: UserNote | null = null

  try {
    let data = await axiosGet(`/api/randomStuff?id=${id}`)
    if (data) {
      result = data
      // console.log(result)
      return result
    }
  } catch (err) {
    console.log(err)
  }
  return result
}
