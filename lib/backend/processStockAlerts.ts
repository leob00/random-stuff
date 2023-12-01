import { LambdaListResponse, UserProfile } from './api/aws/apiGateway'
import { apiConnection } from './api/config'
require('dotenv').config()
import axios from 'axios'
import { constructStockAlertsSubSecondaryKey } from './api/aws/util'
import { StockAlertSubscription } from './api/models/zModels'
import { uniq } from 'lodash'
const conn = apiConnection()

const profileSubMap = new Map<string, StockAlertSubscription[]>()

const processAlerts = async () => {
  try {
    const records = await getProfiles()
    const profiles: UserProfile[] = records.map((m) => JSON.parse(m.data))
    console.log(`found ${profiles.length} profiles`)
    await populateSubscriptionMap(profiles)
    const emails = Array.from(profileSubMap.keys())
    console.log('got mapped subscriptions for: ', emails)
    const allSubs = Array.from(profileSubMap.values()).flatMap((m) => m)
    const allSymbols = allSubs.flatMap((a) => a.symbol)

    console.log('all symbols: ', allSymbols.join(','))
  } catch (err) {
    console.error('error ocurred: ', err)
  }
}

async function populateSubscriptionMap(profiles: UserProfile[]) {
  for (const profile of profiles) {
    const subs = await fetchSubscriptions(profile.username)
    if (subs.length > 0) {
      profileSubMap.set(profile.username, subs)
    }
  }
  // profiles.map(async (profile) => {

  // })
}

async function fetchSubscriptions(username: string) {
  const key = `stock-alerts[${username}]`
  //console.log('loading subscription for: ', key)
  const url = `${conn.aws.url}/searchrandomstuff`
  let response = await axios.post(url, { key: key }, { headers: { 'Content-Type': 'application/json', 'x-api-key': conn.aws.key } })
  const data = response.data as LambdaListResponse
  const subs = data.body
  const result: StockAlertSubscription[] = subs.map((m) => JSON.parse(m.data))
  return result
}

async function getProfiles() {
  const url = `${conn.aws.url}/searchrandomstuff`
  let response = await axios.post(url, { key: 'userProfile' }, { headers: { 'Content-Type': 'application/json', 'x-api-key': conn.aws.key } })
  const data = response.data as LambdaListResponse
  const profiles = data.body

  return profiles
}

processAlerts()
