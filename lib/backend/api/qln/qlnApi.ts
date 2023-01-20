import { DropdownItem } from 'lib/models/dropdown'
import { quoteArraySchema, StockQuote } from '../models/zModels'
import { axiosGet } from './useAxios'

let baseUrl = process.env.NEXT_PUBLIC_QLN_API_URL

export interface NewsItem {
  Source?: NewsTypeIds | string
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
  Saved?: boolean
}

export type NewsTypeIds =
  | 'BbcWorld'
  | 'BbcBusiness'
  | 'GoogleBusiness'
  | 'GoogleTopStories'
  | 'GoogleTech'
  | 'GoogleScience'
  | 'GoogleEntertainment'
  | 'GoogleSports'
  | 'YahooWorld'
  | 'YahooScience'
  | 'CNN'
  | 'Reuters'
  | 'HackerNews'
  | 'TheDaily'
  | 'LifeHacker'

export const newsTypes: DropdownItem[] = [
  {
    text: 'BBC World',
    value: 'BbcWorld',
  },
  {
    text: 'BBC Business',
    value: 'BbcBusiness',
  },
  {
    text: 'CNN',
    value: 'CNN',
  },
  {
    text: 'Google Business',
    value: 'GoogleBusiness',
  },
  {
    text: 'Google Top Stories',
    value: 'GoogleTopStories',
  },
  {
    text: 'Google Tech',
    value: 'GoogleTech',
  },
  {
    text: 'Google Science',
    value: 'GoogleScience',
  },
  {
    text: 'Google Entertainment',
    value: 'GoogleEntertainment',
  },
  {
    text: 'Google Sports',
    value: 'GoogleSports',
  },
  {
    text: 'Hacker News',
    value: 'HackerNews',
  },
  /* {
    text: 'Reuters',
    value: 'Reuters',
  }, */
  {
    text: 'Yahoo World',
    value: 'YahooWorld',
  },
  {
    text: 'Yahoo Science',
    value: 'YahooScience',
  },
  {
    text: 'Life Hacks',
    value: 'LifeHacker',
  },
  {
    text: 'Podcast: The Daily',
    value: 'TheDaily',
  },
]

/* export interface StockQuote {
  Symbol: string
  Company: string
  Price: number
  ChangePercent: number
  TradeDate: string
} */

export async function getNewsFeed() {
  const url = `${baseUrl}/MarketHandshake`
  let params = {
    loadLatestNews: true,
  }
  try {
    let response = await axiosGet(url, params)
    if (response) {
      return response.Body.LatestNews as NewsItem[]
    }
    return [] as NewsItem[]
  } catch (err) {
    const result: NewsItem[] = [
      {
        Headline: 'An error has occurred. News feed currently unavailable. Please try again later',
        HeadlineRecordHash: 'x',
      },
    ]
    return result
  }
}

export async function getNewsBySource(id: NewsTypeIds) {
  let params = {
    type: id,
  }
  let resp = (await axiosGet(`${baseUrl}/NewsBySource`, params)).Body as NewsItem[]
  //console.log(`${baseUrl}/NewsBySource?type=${id}`)
  return resp
}

export async function searchStockQuotes(search?: string) {
  const url = search ? `${baseUrl}/StocksAutoComplete` : `${baseUrl}/Stocks`
  const params = {
    searchString: search ?? '',
  }
  const response = await axiosGet(url, params)
  const result = quoteArraySchema.parse(response.Body)
  return result
}
export async function getStockQuotes(symbols: string[]) {
  const url = `${baseUrl}/Stocks`
  const params = {
    symbols: symbols.join(),
  }
  const response = await axiosGet(url, params)
  const result = quoteArraySchema.parse(response.Body)
  return result
}
