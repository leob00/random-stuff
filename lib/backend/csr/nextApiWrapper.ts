import { UserNote } from 'lib/models/randomStuffModels'
import { LambdaBody, LambdaDynamoRequest, UserProfile } from '../api/aws/apiGateway'
import { axiosGet, axiosPut } from '../api/aws/useAxios'
import { constructUserNoteCategoryKey } from '../api/aws/util'

export async function putUserNote(item: UserNote, secondaryKey: string) {
  let req: LambdaDynamoRequest = {
    id: item.id,
    category: secondaryKey,
    data: item,
  }
  await axiosPut(`/api/putRandomStuff`, req)
}

export async function putUserProfile(item: UserProfile, secondaryKey: string) {
  let req: LambdaDynamoRequest = {
    id: item.id,
    category: secondaryKey,
    data: item,
  }
  await axiosPut(`/api/putRandomStuff`, req)
}
export async function getUserNotes(username: string) {
  let categoryKey = constructUserNoteCategoryKey(username)
  let response = (await axiosGet(`/api/searchRandomStuff?id=${categoryKey}`)) as LambdaBody[]
  //s console.log(response)
  let notes: UserNote[] = response.map((item) => JSON.parse(item.data))
  return notes
}
