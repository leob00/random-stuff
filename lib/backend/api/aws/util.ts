import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getUtcNow } from 'lib/util/dateUtil'
dayjs.extend(utc)
export function constructUserProfileKey(username: string) {
  return `user-profile[${username}]`
}
export function constructUserNotePrimaryKey(username: string) {
  const utcNow = getUtcNow().format()
  return `user-note[${utcNow}][${username}]`
}
export function constructUserNoteCategoryKey(username: string) {
  return `user-note[${username}]`
}
