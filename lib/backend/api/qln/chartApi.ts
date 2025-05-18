import { StockHistoryItem, quoteHistorySchema } from '../models/zModels'
import { DateRange, HistoricalAggregate, QlnApiResponse, serverGetFetch, serverPostFetch } from './qlnApi'
import { MovingAvg } from './qlnModels'

export type StockChartApiResponse = {
  History: StockHistoryItem[]
  Aggregate: HistoricalAggregate
  AvailableDates: DateRange | null
  Name?: string | null
  MovingAvg?: MovingAvg[] | null
}

export type MarketCategory = 'stocks' | 'commodities' | 'crypto'

export async function getStockOrFutureChart(symbol: string, days?: number, isStock = true) {
  const endPoint = isStock ? `/StockHistoryChart?symbol=${symbol}&days=${days ?? 90}` : `/FuturesHistoryChart?symbol=${symbol}&days=${days ?? 90}`
  const resp = await serverGetFetch(endPoint)
  const apiResult: StockChartApiResponse = {
    Aggregate: resp.Body.Aggregate as HistoricalAggregate,
    History: quoteHistorySchema.parse(resp.Body.History),
    AvailableDates: resp.Body.AvailableDates ? (resp.Body.AvailableDates as DateRange) : null,
  }

  return apiResult
}

export async function getMarketChart(symbol: string, marketCategory: MarketCategory, days?: number): Promise<StockChartApiResponse> {
  let resp: QlnApiResponse = {
    Body: '',
    Errors: [],
  }
  switch (marketCategory) {
    case 'stocks':
      resp = await serverGetFetch(`/StockHistoryChart?symbol=${symbol}&days=${days ?? 90}`)
      break
    case 'commodities':
      resp = await serverGetFetch(`/FuturesHistoryChart?symbol=${symbol}&days=${days ?? 90}`)
      break
    case 'crypto':
      resp = await serverPostFetch({ body: { key: symbol, HistoryDays: days ?? 30 } }, '/Crypto')
  }

  const apiResult: StockChartApiResponse = {
    Aggregate: resp.Body.Aggregate as HistoricalAggregate,
    History: quoteHistorySchema.parse(resp.Body.History),
    AvailableDates: resp.Body.AvailableDates ? (resp.Body.AvailableDates as DateRange) : null,
    MovingAvg: resp.Body.MovingAvg ? (resp.Body.MovingAvg as MovingAvg[]) : null,
  }

  return apiResult
}
