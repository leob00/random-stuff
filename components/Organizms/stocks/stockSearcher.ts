import { SymbolCompany } from 'lib/backend/api/qln/qlnApi'
import { getListFromMap } from 'lib/util/collectionsNative'
import { take } from 'lodash'
import lookupData from 'public/data/symbolCompanies.json'
export function searchAheadStocks(text: string) {
  let searchResults: SymbolCompany[] = []

  if (text.length === 0) {
    return searchResults
  }
  const directHit = lookupData.find((m) => m.Symbol.toLowerCase() === text.toLowerCase())
  if (directHit) {
    searchResults.push(directHit)
  }
  let moreResults = take(
    lookupData.filter((m) => m.Symbol.toLowerCase().startsWith(text.toLowerCase()) || m.Company.toLowerCase().startsWith(text.toLowerCase())),
    10,
  )
  if (directHit) {
    moreResults = moreResults.filter((m) => m.Symbol !== directHit.Symbol)
  }
  searchResults.push(...moreResults)
  if (searchResults.length === 0) {
    const words = text.split(' ')
    const map = new Map<string, SymbolCompany>()
    words.forEach((word) => {
      const results = take(
        lookupData.filter((m) => m.Company.toLowerCase().includes(word.toLowerCase())),
        10,
      )
      results.forEach((result) => {
        map.set(result.Symbol, result)
      })
    })
    const secondTry = take(getListFromMap(map), 10)
    searchResults = secondTry
  }
  return searchResults
}
