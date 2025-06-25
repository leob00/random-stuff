import { findTextBetweenBrackets } from 'lib/util/stringUtil'

export function getUsernameFromKey(key: string) {
  return findTextBetweenBrackets(key)[0][1]
}

export function getPorfolioIdFromKey(key: string) {
  return findTextBetweenBrackets(key)[1][1]
}
