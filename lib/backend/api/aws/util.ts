import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
export function constructUserProfileKey(username: string) {
  return `user-profile|${username}|`
}
export function constructUserNotePrimaryKey(username: string) {
  const utcNow = dayjs().utc().format()
  return `user-note-${utcNow}|${username}|`
}
export function constructUserNoteCategoryKey(username: string) {
  return `user-note|${username}|`
}
