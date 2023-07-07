import { getUserStockList, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { quoteArraySchema, quoteHistorySchema, StockQuote } from '../models/zModels'
import { get, getList } from '../fetchFunctions'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import dayjs from 'dayjs'

export const qlnApiBaseUrl = process.env.NEXT_PUBLIC_QLN_API_URL

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

export interface Job {
  NextRunDate?: string
  Name: string
  Description: string
  StartDate?: string
  Status: 1 | 2
  ProgressPercent?: number
  LastMessage?: string
  EndRunDate?: string
  Chart?: LineChart
  Executer?: string
  RecordsProcessed?: number
}

export interface LineChart {
  XValues: string[]
  YValues: string[]
  RawData?: any[]
}

export async function getNewsFeed() {
  const url = `${qlnApiBaseUrl}/MarketHandshake`
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
export interface SymbolCompany {
  Symbol: string
  Company: string
}

export async function getNewsBySource(id: NewsTypeIds) {
  let params = {
    type: id,
  }
  let resp = (await get(`${qlnApiBaseUrl}/NewsBySource`, params)).Body as NewsItem[]
  //console.log(`${baseUrl}/NewsBySource?type=${id}`)
  return resp
}
export async function getNewsBySymbol(symbol: string) {
  let params = {
    symbol: symbol,
  }
  let resp = (await get(`${qlnApiBaseUrl}/NewsBySymbol`, params)).Body as NewsItem[]
  //console.log(`${baseUrl}/NewsBySource?type=${id}`)
  return resp
}

export async function searchStockQuotes(search: string) {
  const response = await get(`${qlnApiBaseUrl}/StocksAutoComplete`, {
    searchString: search ?? '',
  })
  const result = quoteArraySchema.parse(response.Body)
  return result
}
export async function getStockQuotes(symbols: string[]) {
  const url = `${qlnApiBaseUrl}/Stocks`
  const params = {
    symbols: symbols.join(),
  }
  const response = await get(url, params)
  const result = quoteArraySchema.parse(response.Body)
  return result
}

export async function getStockOrFutureChart(symbol: string, days?: number, isStock = true) {
  const url = isStock ? `${qlnApiBaseUrl}/StockHistoryChart` : `${qlnApiBaseUrl}/FuturesHistoryChart`
  const params = {
    symbol: symbol,
    days: days ?? 90,
  }
  const response = await get(url, params)
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
    if (result.length > 0 && quotes.length > 0 && dayjs(result[0].TradeDate).isAfter(dayjs(quotes[0].TradeDate))) {
      console.log(`Quotes are stale.`)
      putUserStockList(username, result)
      console.log(`Saved ${result.length} quotes.`)
    } else {
      console.log('stocks are up to date')
    }
  }

  return result
}
export async function getJobs() {
  const url = `${qlnApiBaseUrl}/BatchJobList`
  const response = await get(url)
  const result = response.Body as Job[]
  return result
}

export async function getJob(jobName: string) {
  const url = `${qlnApiBaseUrl}/BatchJobDetail`

  const response = await get(url, { jobName: jobName })
  const result = response.Body as Job
  return result
}

export interface QlnApiResponse {
  RequestId: string
  ResponseId: string
  ResponseDate: string
  Body: any
}

export async function getFutures() {
  const url = `${qlnApiBaseUrl}/Futures`
  const response = await get(url)
  const result = response.Body as StockQuote[]
  return result
}

export interface EconCalendarItem {
  EventDate: string
  Name: string
  Description: string | null
  Url: string | null
}

export async function getEconCalendar() {
  const response = await get(`${qlnApiBaseUrl}/EconCalendar`)
  const result = response.Body as EconCalendarItem[]
  return result
}

export interface StockEarning {
  Symbol: string
  ActualEarnings?: number | null
  EstimatedEarnings?: number | null
  ReportDate?: string | null
}

export async function getStockEarnings(symbol: string) {
  const response = await get(`${qlnApiBaseUrl}/StockEarnings`, {
    symbol: symbol,
  })

  const result = response.Body as StockEarning[]
  return result
}
