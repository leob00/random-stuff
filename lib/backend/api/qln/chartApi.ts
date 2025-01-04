import { StockHistoryItem, quoteHistorySchema } from '../models/zModels'
import { HistoricalAggregate, serverGetFetch } from './qlnApi'

export type StockChartApiResponse = {
  History: StockHistoryItem[]
  Aggregate: HistoricalAggregate
}

export async function getStockOrFutureChart(symbol: string, days?: number, isStock = true) {
  const endPoint = isStock ? `/StockHistoryChart?symbol=${symbol}&days=${days ?? 90}` : `/FuturesHistoryChart?symbol=${symbol}&days=${days ?? 90}`
  const resp = await serverGetFetch(endPoint)
  const apiResult: StockChartApiResponse = {
    Aggregate: resp.Body.Aggregate as HistoricalAggregate,
    History: quoteHistorySchema.parse(resp.Body.History),
  }

  return apiResult
}
