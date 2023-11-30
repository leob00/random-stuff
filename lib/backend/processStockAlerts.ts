import { apiConnection } from './api/config'
require('dotenv').config()

const processAlerts = async () => {
  try {
    const url = process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL
    const conns = apiConnection()

    console.log('url: ', url)
    //const profiles = await searchRandomStuffBySecIndex('userProfile')
    //console.log(`found ${profiles.length} profiles`)
  } catch (err) {
    console.error('error ocurred: ', err)
  }
}
// ;async () => {

// }

processAlerts()
