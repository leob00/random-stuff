import dayjs from 'dayjs'
import { chunk } from 'lodash'
import { get } from '../fetchFunctions'
import { quoteHistorySchema, StockHistoryItem } from '../models/zModels'
import { qlnApiBaseUrl } from './qlnApi'

export async function getStockOrFutureChart(symbol: string, days?: number, isStock = true) {
  const url = isStock ? `${qlnApiBaseUrl}/StockHistoryChart` : `${qlnApiBaseUrl}/FuturesHistoryChart`
  const params = {
    symbol: symbol,
    days: days ?? 90,
  }
  const response = await get(url, params)
  const result = quoteHistorySchema.parse(response.Body)

  const startDt = dayjs(result[0].TradeDate)
  const diff = dayjs().diff(startDt, 'months')
  if (diff >= 11) {
    const decimated: StockHistoryItem[] = []
    const chunks = chunk(result, 22)
    chunks.forEach((chunk, i) => {
      const isLast = i === chunks.length - 1
      decimated.push(!isLast ? chunks[i][0] : chunks[i][chunk.length - 1])
    })

    return decimated
  }
  return result
}
