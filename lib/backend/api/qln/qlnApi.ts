import { getUserStockList, putUserStockList } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { quoteArraySchema, StockQuote } from '../models/zModels'
import { get, post, postBody } from '../fetchFunctions'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import dayjs from 'dayjs'
import { apiConnection } from '../config'
import { EconomicDataItem, StockReportTypes } from './qlnModels'
import { StockAdvancedSearchFilter } from 'components/Organizms/stocks/advanced-search/advancedSearchFilter'
import {
  getMarketCapFilters,
  hasMarketCapFilter,
  hasMovingAvgFilter,
  hasNumberRangeFilter,
} from 'components/Organizms/stocks/advanced-search/stocksAdvancedSearch'

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
  sourceDescription?: string
}

export type NewsTypeIds =
  | 'BbcWorld'
  | 'BbcBusiness'
  | 'BloombergMarkets'
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
    text: 'Bloomberg',
    value: 'BloombergMarkets',
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
  {
    text: 'Fox News Latest Headlines',
    value: 'FoxNewsLatest',
  },
  {
    text: 'Fox News World',
    value: 'FoxNewsWorld',
  },
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
  {
    text: 'Life Hacker',
    value: 'LifeHacker',
  },
  // {
  //   text: 'MarketWatch Pulse',
  //   value: 'MarketWatchPulse',
  // },
  {
    text: 'MarketWatch Top Stories',
    value: 'MarketWatchTopStories',
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
    text: 'The Guardian',
    value: 'TheGuardian',
  },
  {
    text: 'The Hill - Administration',
    value: 'TheHillAdministration',
  },
  {
    text: 'The Hill - All News',
    value: 'TheHillAllNews',
  },
  {
    text: 'The Hill - Lobbying',
    value: 'TheHillLobbying',
  },
  {
    text: 'The Onion',
    value: 'TheOnion',
  },
  // problem with encoding{
  //   text: 'UN - Top Stories',
  //   value: 'UNWorld',
  // },
  {
    text: 'Washington Post',
    value: 'WashingtonPost',
  },
  {
    text: 'Washington Times',
    value: 'WashingtonTimes',
  },
  {
    text: 'Yahoo Finance',
    value: 'YahooFinance',
  },
  {
    text: 'Yahoo World',
    value: 'YahooWorld',
  },
]
export type JoBLog = {
  JobId: number
  UniqueRecordId: string
  TotalMinutes: number
  DateCompleted: string
  RecordsProcessed: number
}

export interface Job {
  NextRunDate?: string | null
  Name: string
  Description: string
  StartDate?: string
  Status: number
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

export async function searchStockQuotes(search: string) {
  const response = await get(`${qlnApiBaseUrl}/StocksAutoComplete`, {
    searchString: search ?? '',
  })
  const result = quoteArraySchema.parse(response.Body)
  return result
}

export async function getStockQuotesServer(symbols: string[]) {
  const req: QlnApiRequest = {
    key: symbols.join(),
  }
  try {
    const url = `${qlnApiBaseUrl}/Stocks`
    const resp = await post(url, req)
    const result = quoteArraySchema.parse(resp.Body)
    return result
  } catch (err) {
    console.error(err)
    return []
  }
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

export async function getLatestQuotes(symbols: string[]) {
  if (symbols.length === 0) {
    return []
  }
  return await getStockQuotes(symbols)
}

export async function getJob(token: string, jobName: string) {
  const url = `${qlnApiBaseUrl}/BatchJobDetail`
  const response = await get(url, { Token: token, jobName: jobName })
  const result = response.Body as Job
  return result
}

export async function getReport(id: StockReportTypes, take = 100) {
  const url = `${qlnApiBaseUrl}/StockReports`

  const response = await get(url, { id: id, take: take })
  const result = response.Body as StockQuote[]
  return result
}

export interface QlnApiResponse {
  ResponseCode?: string
  RequestId?: string
  ResponseId?: string
  ResponseDate?: string
  ResponseDateEst?: string | null
  Body: any
  Errors: Array<{ Code: string; Message: string }>
}
export interface QlnApiRequest {
  key?: string
  body?: any
}

export async function getFutures() {
  const url = `${qlnApiBaseUrl}/Futures`
  const response = await get(url)
  const result = response.Body.History as StockQuote[]
  return result
}

export interface EconCalendarItem {
  RecordId: string
  TypeId: string
  EventDate: string
  Actual: number | null
  Consensus: number | null
  Previous: number | null
  TypeName: string
  TypeDescription: string
  Country: string
  ActualUnits: string | null
  ConsensusUnits: string | null
  PreviousUnits: string | null
}
export interface StockEarning {
  Symbol: string
  ActualEarnings?: number | null
  EstimatedEarnings?: number | null
  ReportDate?: string | null
  StockQuote?: StockQuote
  Year?: number
  Quarter?: number
  RecordId?: number
}

export interface StockEarningAggregate {
  Year: number
  Quarter: number
  RecordCount: number
  PositiveCount: number
  NegativeCount: number
  NeutralCount: number
}

export interface DateRangeFilter {
  startDate: string
  endDate: string
}
export interface DateRange {
  StartDate: string
  EndDate: string
}
export interface HistoricalAggregate {
  Days: number
  Change: number
  Percentage: number
  AvailableDates: DateRange | null
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

export async function getEconDataReport(id: number, startYear?: number, endYear?: number) {
  const req = {
    Id: id,
    StartYear: startYear,
    EndYear: endYear,
  }

  const resp = await serverPostFetch({ body: req }, '/EconReports')
  const result = resp.Body.Item as EconomicDataItem
  return result
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
  const resp = await postBody(`/api/qln?url=${qlnApiBaseUrl}${endpoint}`, 'POST', req)
  const result = resp as QlnApiResponse
  return result
}
export async function serverDeleteFetch(req: QlnApiRequest, endpoint: string) {
  const resp = await postBody(`/api/qln?url=${qlnApiBaseUrl}${endpoint}`, 'DELETE', req)
  const result = resp as QlnApiResponse
  return result
}

export async function serverGetFetch(endpoint: string) {
  const url = `/api/qln?url=${qlnApiBaseUrl}${encodeURIComponent(endpoint)}`
  const resp = await get(`${url}`)
  const result = resp as QlnApiResponse
  return result
}
type StocksSearchNumericRangeFilter = {
  From: number | null
  To: number | null
}
type MovingAvgDaysFilter = {
  Days: number
} & StocksSearchNumericRangeFilter

type StockAdvancedSearchPostModel = {
  Take: number
  MarketCap: {
    Items: string[]
  } | null
  MovingAvg: MovingAvgDaysFilter | null
  PeRatio: StocksSearchNumericRangeFilter | null
  AnnualYield: StocksSearchNumericRangeFilter | null
  Symbols: string[] | null
}

export async function executeStockAdvancedSearch(filter: StockAdvancedSearchFilter) {
  const postBody: StockAdvancedSearchPostModel = {
    Take: filter.take,
    MarketCap: null,
    MovingAvg: null,
    PeRatio: null,
    AnnualYield: null,
    Symbols: null,
  }
  if (filter.symbols) {
    postBody.Symbols = filter.symbols
    postBody.MovingAvg = {
      Days: 1,
      From: null,
      To: null,
    }
  } else {
    if (hasMarketCapFilter(filter.marketCap)) {
      postBody.MarketCap = {
        Items: getMarketCapFilters(filter.marketCap),
      }
    }
    if (hasMovingAvgFilter(filter.movingAvg)) {
      postBody.MovingAvg = {
        Days: filter.movingAvg.days ?? 1,
        From: filter.movingAvg.from ?? null,
        To: filter.movingAvg.to ?? null,
      }
    }
    if (hasNumberRangeFilter(filter.peRatio)) {
      postBody.PeRatio = {
        From: filter.peRatio.from ?? null,
        To: filter.peRatio.to ?? null,
      }
    }
    if (filter.annualYield) {
      if (hasNumberRangeFilter(filter.annualYield)) {
        postBody.AnnualYield = {
          From: filter.annualYield.from ?? null,
          To: filter.annualYield.to ?? null,
        }
      }
    }
  }

  const result = await serverPostFetch(
    {
      body: postBody,
    },
    '/StockAdvancedSearch',
  )
  return result
}
