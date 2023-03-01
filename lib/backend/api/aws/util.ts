import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getGuid, myEncrypt } from 'lib/backend/encryption/useEncryptor'
import { getSecondsFromEpoch, getUtcNow } from 'lib/util/dateUtil'
dayjs.extend(utc)
export function constructUserProfileKey(username: string) {
  return `user-profile[${username}]`
}
export function constructUserNotePrimaryKey(username: string) {
  //const utcNow = getUtcNow().format()
  return `user-note[${getSecondsFromEpoch()}][${username}]`
}
export function constructUserNoteCategoryKey(username: string) {
  return `user-note[${username}]`
}
export function constructUserGoalsKey(username: string) {
  return `user-goals[${username}]`
}

export function constructDymamoPrimaryKey(arg1: string, arg2: string, arg3: string) {
  return `${arg1}[${arg2}][${arg3}]`
}

export function constructUserGoalPk(username: string) {
  return `user-goal[${username}][${getSecondsFromEpoch()}]`
}
export function constructUserTaskPk(username: string) {
  return `user-task[${username}][${getSecondsFromEpoch()}]`
}

export function constructUserGoalTaksSecondaryKey(username: string) {
  return `user-goal-tasks[${username}]`
}

export function constructUserSecretSecondaryKey(username: string) {
  return `user-sec[${username}]`
}
export function constructUserSecretPrimaryKey(username: string) {
  const guid = getGuid()
  return `user-sec[${username}][${guid}]`
}
