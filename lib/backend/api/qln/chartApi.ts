import { StockHistoryItem, quoteHistorySchema } from '../models/zModels'
import { DateRange, HistoricalAggregate, serverGetFetch } from './qlnApi'

export type StockChartApiResponse = {
  History: StockHistoryItem[]
  Aggregate: HistoricalAggregate
  AvailableDates: DateRange | null
}

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
