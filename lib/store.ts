export interface SiteSettings {
  lastReloadDate?: string
}
const userStoreItemName = 'rstuff-settings'
export const getSiteSettings = (): SiteSettings => {
  let result: SiteSettings = {}
  let str = window.localStorage.getItem(userStoreItemName)
  if (!str) {
    result.lastReloadDate = new Date().toString()
    setSiteSettings(result)
  }

  return result
}
export const setSiteSettings = (settings: SiteSettings) => {
  window.localStorage.setItem(userStoreItemName, JSON.stringify(settings))
}
