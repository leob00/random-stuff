import { quoteHistorySchema } from '../models/zModels'
import { serverGetFetch } from './qlnApi'

export async function getStockOrFutureChart(symbol: string, days?: number, isStock = true) {
  const endPoint = isStock ? `/StockHistoryChart?symbol=${symbol}&days=${days ?? 90}` : `/FuturesHistoryChart?symbol=${symbol}&days=${days ?? 90}`
  const resp = await serverGetFetch(endPoint)
  const result = quoteHistorySchema.parse(resp.Body.History)
  return result
}
