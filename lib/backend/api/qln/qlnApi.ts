import { getUserStockList, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { quoteArraySchema, quoteHistorySchema, StockQuote } from '../models/zModels'
import { get } from '../fetchFunctions'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'

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
  Rank?: number
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
  | 'Pluralistic'

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
  {
    text: 'Pluralistic',
    value: 'Pluralistic',
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
    let response = await get(url, params)
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
  let resp = (await get(`${baseUrl}/NewsBySource`, params)).Body as NewsItem[]
  //console.log(`${baseUrl}/NewsBySource?type=${id}`)
  return resp
}
export async function getNewsBySymbol(symbol: string) {
  let params = {
    symbol: symbol,
  }
  let resp = (await get(`${baseUrl}/NewsBySymbol`, params)).Body as NewsItem[]
  //console.log(`${baseUrl}/NewsBySource?type=${id}`)
  return resp
}

export async function searchStockQuotes(search?: string) {
  const url = search ? `${baseUrl}/StocksAutoComplete` : `${baseUrl}/Stocks`
  const params = {
    searchString: search ?? '',
  }
  const response = await get(url, params)
  const result = quoteArraySchema.parse(response.Body)
  return result
}
export async function getStockQuotes(symbols: string[]) {
  const url = `${baseUrl}/Stocks`
  const params = {
    symbols: symbols.join(),
  }
  const response = await get(url, params)
  const result = quoteArraySchema.parse(response.Body)
  return result
}
export async function getStockChart(symbol: string, days?: number) {
  const url = `${baseUrl}/StockHistoryChart`
  const params = {
    symbol: symbol,
    days: days ?? 90,
  }
  const response = await get(url, params)
  //console.log(response)
  const result = quoteHistorySchema.parse(response.Body)
  return result
}

export async function getUserStockListLatest(username: string) {
  const stockList = await getUserStockList(username)
  const latestQuotes = await getLatestQuotes(stockList.map((o) => o.Symbol))
  const slMap = new Map<string, StockQuote>()
  stockList.map((o) => slMap.set(o.Symbol, o))
  latestQuotes.forEach((latest) => {
    slMap.set(latest.Symbol, latest)
  })
  const result: StockQuote[] = []
  slMap.forEach((sl) => {
    result.push(sl)
  })
  return result
}
export async function getLatestQuotes(symbols: string[]) {
  if (symbols.length === 0) {
    return []
  }
  return await getStockQuotes(symbols)
}

export async function refreshQuotes(quotes: StockQuote[], username?: string) {
  const map = getMapFromArray(quotes, 'Symbol')
  const symbols = quotes.map((o) => o.Symbol)
  const latest = await getLatestQuotes(symbols)
  latest.forEach((item) => {
    map.set(item.Symbol, item)
  })

  const result: StockQuote[] = getListFromMap(map)
  if (username) {
    if (JSON.stringify(result) !== JSON.stringify(quotes)) {
      console.log(`Quotes are stale.`)
      putUserStockList(username, result)
      console.log(`Saved ${result.length} quotes.`)
    } else {
      console.log('stock are up to date')
    }
  }

  return result
}
