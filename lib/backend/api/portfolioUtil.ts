import { extractBracketValues } from 'lib/util/stringUtil'

export function getUsernameFromKey(key: string) {
  return extractBracketValues(key)[0]
}

export function getPorfolioIdFromKey(key: string) {
  return extractBracketValues(key)[1]
}
