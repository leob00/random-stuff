import { isBrowser } from 'lib/util/system'

export interface User {
  userId: string
}
const userStoreItemName = 'rstuff-user'
export const getUser = (): User | null => {
  if (isBrowser()) {
    let data = window.localStorage.getItem(userStoreItemName)
    if (data) {
      return JSON.parse(data)
    }
  }
  return null
}
export const setUser = (user: User) => {
  if (isBrowser()) {
    window.localStorage.setItem(userStoreItemName, JSON.stringify(user))
  }
}
