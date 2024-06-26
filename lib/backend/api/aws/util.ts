import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getGuid } from 'lib/backend/encryption/useEncryptor'
import { getSecondsFromEpoch } from 'lib/util/dateUtil'
import { DynamoKeys } from './models/apiGatewayModels'
dayjs.extend(utc)
export function constructUserProfileKey(username: string) {
  return `user-profile[${username}]`
}
export function constructUserNoteTitlesKey(username: string) {
  return `user-note-titles[${username}]`
}
export function constructUserNotePrimaryKey(username: string) {
  //const utcNow = getUtcNow().format()
  return `user-note[${crypto.randomUUID()}][${username}]`
}
export function constructUserNoteCategoryKey(username: string) {
  return `user-note[${username}]`
}
export function constructUserGoalsKey(username: string) {
  return `user-goals[${username}]`
}

export function constructDynamoKey(arg1: DynamoKeys, arg2: string, arg3?: string) {
  if (!arg3) {
    return `${arg1}[${arg2}]`
  }
  return `${arg1}[${arg2}][${arg3}]`
}

export function constructStockPositionSecondaryKey(username: string, portfolioId: string) {
  return `${constructDynamoKey('stockportfolio', username, portfolioId)}position`
}

export function constructUserGoalPk(username: string) {
  return `user-goal[${username}][${crypto.randomUUID()}]`
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
export function constructStockAlertsSubPrimaryKey(username: string, symbol: string) {
  return `stock-alerts[${username}][${symbol}]`
}
export function constructStockAlertsSubSecondaryKey(username: string) {
  return `stock-alerts[${username}]`
}
