import { logger } from 'lib/util/system'
import { axiosGet } from './useAxios'

let baseUrl = process.env.NEXT_QLN_API_URL

export interface NewsItem {
  Source?: string
  Symbol?: string
  Headline?: string
  Link?: string
  TeaserImageUrl?: string
  PublishDate?: string
  Description?: string
  Token?: string
  IsAuth?: boolean
  ApiUrl?: string
  HeadlineRecordHash?: string
  Read?: boolean
}

export async function getNewsFeed() {
  const url = `${baseUrl}/MarketHandshake`
  let params = {
    loadLatestNews: true,
  }
  let response = (await axiosGet(url, params)).Body.LatestNews as NewsItem[]
  //console.log(`newsfeed: retrieved ${response.length} news articles.`)
  logger(`newsfeed: retrieved ${response.length} news articles.`)
  //console.log(JSON.stringify(response))

  return response
}
