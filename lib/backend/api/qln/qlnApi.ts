import { getUserStockList, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { quoteArraySchema, StockQuote } from '../models/zModels'
import { get, post } from '../fetchFunctions'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import dayjs from 'dayjs'
import { apiConnection } from '../config'
import { StockReportTypes } from './qlnModels'
import { EconDataModel } from 'components/Organizms/econ/EconDataLayout'

const config = apiConnection()
const qlnApiBaseUrl = config.qln.url

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
  | 'AbcInternational'
  | 'HeadlinesOfToday'
  | 'NPR'
  | 'SkyNews'
  | 'SpiegelInternational'
  | 'CBSWorld'
  | 'France24'
  | 'CanadaGlobalNews'
  | 'WashingtonTimes'
  | 'WashingtonPost'
  | 'DailyTelegraph'
  | 'RawStory'

export const newsTypes: DropdownItem[] = [
  {
    text: 'ABC International',
    value: 'AbcInternational',
  },

  {
    text: 'BBC Business',
    value: 'BbcBusiness',
  },
  {
    text: 'BBC World',
    value: 'BbcWorld',
  },
  {
    text: 'CBS World',
    value: 'CBSWorld',
  },
  {
    text: 'CNBC',
    value: 'CNBC',
  },
  {
    text: 'Canada Global News',
    value: 'CanadaGlobalNews',
  },
  // {
  //   text: 'Daily Telegraph',
  //   value: 'DailyTelegraph',
  // },
  {
    text: 'France 24',
    value: 'France24',
  },
  {
    text: 'Google Business',
    value: 'GoogleBusiness',
  },
  {
    text: 'Google Entertainment',
    value: 'GoogleEntertainment',
  },
  {
    text: 'Google Science',
    value: 'GoogleScience',
  },
  {
    text: 'Google Sports',
    value: 'GoogleSports',
  },
  {
    text: 'Google Tech',
    value: 'GoogleTech',
  },
  {
    text: 'Google Top Stories',
    value: 'GoogleTopStories',
  },

  {
    text: 'Hacker News',
    value: 'HackerNews',
  },
  // {
  //   text: 'Headlines of Today',
  //   value: 'HeadlinesOfToday',
  // },
  {
    text: 'Life Hacker',
    value: 'LifeHacker',
  },
  {
    text: 'NPR',
    value: 'NPR',
  },
  {
    text: 'Pluralistic',
    value: 'Pluralistic',
  },
  {
    text: 'Podcast: The Daily',
    value: 'TheDaily',
  },
  {
    text: 'Raw Story',
    value: 'RawStory',
  },

  {
    text: 'Sky News',
    value: 'SkyNews',
  },
  {
    text: 'Spiegel International',
    value: 'SpiegelInternational',
  },
  {
    text: 'Washington Post',
    value: 'WashingtonPost',
  },
  {
    text: 'Washington Times',
    value: 'WashingtonTimes',
  },
  {
    text: 'Yahoo Science',
    value: 'YahooScience',
  },
  {
    text: 'Yahoo World',
    value: 'YahooWorld',
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
  Disabled?: boolean
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
  return resp
}
export async function getNewsBySymbol(symbol: string) {
  let params = {
    symbol: symbol,
  }
  let resp = (await get(`${qlnApiBaseUrl}/NewsBySymbol`, params)).Body as NewsItem[]
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
  const req: QlnApiRequest = {
    key: symbols.join(),
  }
  try {
    const resp = await serverPostFetch(req, '/Stocks')
    const result = quoteArraySchema.parse(resp.Body)
    return result
  } catch (err) {
    console.error(err)
    return []
  }
}
export async function getStockQuote(symbol: string) {
  const req: QlnApiRequest = {
    key: symbol,
  }
  try {
    const resp = await serverPostFetch(req, '/Stocks')
    const result = quoteArraySchema.parse(resp.Body)
    return result.length > 0 ? result[0] : null
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getCacheStats(token: string) {
  const response = await get(`${qlnApiBaseUrl}/ServerSettings`, {
    Token: token,
  })

  return response as QlnApiResponse
}
export async function resetStockCache(token: string) {
  const response = (await post(`${qlnApiBaseUrl}/StockCache?Token=${token}`, {})) as QlnApiResponse

  return response
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
      console.error(`Quotes are stale.`)
      putUserStockList(username, result)
    }
  }

  return result
}
export async function getJobs(token: string) {
  const url = `${qlnApiBaseUrl}/BatchJobList`
  const response = await get(url, { Token: token })
  const result = response.Body as Job[]
  return result
}

export async function getJob(token: string, jobName: string) {
  const url = `${qlnApiBaseUrl}/BatchJobDetail`

  const response = await get(url, { Token: token, jobName: jobName })
  const result = response.Body as Job
  return result
}

export async function getReport(id: StockReportTypes) {
  const url = `${qlnApiBaseUrl}/StockReports`

  const response = await get(url, { id: id })
  const result = response.Body as StockQuote[]
  return result
}

export interface QlnApiResponse {
  RequestId: string
  ResponseId: string
  ResponseDate: string
  Body: any
  Errors: Array<{ Code: string; Message: string }>
}
export interface QlnApiRequest {
  key?: string
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
export interface StockEarning {
  Symbol: string
  ActualEarnings?: number | null
  EstimatedEarnings?: number | null
  ReportDate?: string | null
  StockQuote?: StockQuote
}

export interface Company {
  Symbol: string
  CompanyName?: string
  Description?: string
  Sector?: string
  Industry?: string
  Ceo?: string
  LogoRelativePath: string | null
  IconRelativePath: string | null
}

export async function getEconCalendar() {
  const response = await get(`${qlnApiBaseUrl}/EconCalendar`)
  const result = response.Body as EconCalendarItem[]
  return result
}

export async function getStockEarnings(symbol: string) {
  const response = await get(`${qlnApiBaseUrl}/StockEarnings`, {
    symbol: symbol,
  })

  const result = response.Body as StockEarning[]
  return result
}

export async function getRecentStockEarnings(symbol: string) {
  const response = await get(`${qlnApiBaseUrl}/RecentEarnings`)
  const resp = response as QlnApiResponse
  return resp.Body as StockEarning[]
}

export async function getCompanyProfile(symbols: string[]) {
  const response = await get(`${qlnApiBaseUrl}/CompanyDetails`, {
    symbols: symbols,
  })

  const result = response.Body as Company[]
  return result
}

export async function getEconDataReport(id: number, startYear: number, endYear: number) {
  const url = `${qlnApiBaseUrl}/EconReports`
  const resp = (await post(url, { Id: id, StartYear: startYear, EndYear: endYear })) as EconDataModel
  return resp.Body.Item
}
export async function getEconDataReportSnp(startYear: number, endYear: number) {
  const result = await getEconDataReport(15, startYear, endYear)
  return result
}
export async function getEconDataReportDowJones(startYear: number, endYear: number) {
  const result = await getEconDataReport(14, startYear, endYear)
  return result
}

export async function serverPostFetch(req: QlnApiRequest, endpoint: string) {
  const resp = await post(`/api/qln?url=${qlnApiBaseUrl}${endpoint}`, req)
  const result = resp as QlnApiResponse
  return result
}

export async function serverGetFetch(endpoint: string) {
  const url = `/api/qln?url=${qlnApiBaseUrl}${endpoint}`
  console.log('url: ', url)
  const resp = await get(`/api/qln?url=${qlnApiBaseUrl}${endpoint}`)
  const result = resp as QlnApiResponse
  return result
}
