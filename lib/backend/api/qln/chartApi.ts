import dayjs from 'dayjs'
import { chunk } from 'lodash'
import { apiConnection } from '../config'
import { get } from '../fetchFunctions'
import { quoteHistorySchema, StockHistoryItem } from '../models/zModels'

export async function getStockOrFutureChart(symbol: string, days?: number, isStock = true) {
  const config = apiConnection().qln

  const url = isStock ? `${config.url}/StockHistoryChart` : `${config.url}/FuturesHistoryChart`
  const params = {
    symbol: symbol,
    days: days ?? 90,
  }
  const response = await get(url, params)
  const result = quoteHistorySchema.parse(response.Body)
  if (result.length === 0) {
    return result
  }

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
