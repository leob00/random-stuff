import { UserNote } from 'lib/models/randomStuffModels'
import { LambdaBody, LambdaDynamoRequest, LambdaResponse, UserProfile } from '../api/aws/apiGateway'
import { axiosGet, axiosPut } from '../api/aws/useAxios'
import { constructUserNoteCategoryKey, constructUserProfileKey } from '../api/aws/util'

export async function putUserNote(item: UserNote, secondaryKey: string) {
  let req: LambdaDynamoRequest = {
    id: item.id!,
    category: secondaryKey,
    data: item,
  }
  await axiosPut(`/api/putRandomStuff`, req)
}

export async function putUserProfile(item: UserProfile) {
  let req: LambdaDynamoRequest = {
    id: item.id,
    category: 'userProfile',
    data: item,
  }
  await axiosPut(`/api/putRandomStuff`, req)
}
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
      result = data
      // console.log(result)
      return result
    }
  } catch (err) {
    console.log(err)
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
