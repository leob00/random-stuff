import { apiConnection } from '../config'
import { quoteHistorySchema } from '../models/zModels'
import { serverGetFetch } from './qlnApi'

export async function getStockOrFutureChart(symbol: string, days?: number, isStock = true) {
  const config = apiConnection().qln

  const url = isStock ? `${config.url}/StockHistoryChart` : `${config.url}/FuturesHistoryChart`

  const params = {
    symbol: symbol,
    days: days ?? 90,
  }
  const endPoint = isStock ? `/StockHistoryChart` : `/FuturesHistoryChart`
  const resp = await serverGetFetch(endPoint, params)

  //const response = await get(url, params)
  const result = quoteHistorySchema.parse(resp.Body)
  if (result.length === 0) {
    return result
  }
  return result

  // attempts to decimate chart
  // const startDt = dayjs(result[0].TradeDate)
  // const diff = dayjs().diff(startDt, 'months')
  // if (diff >= 11) {
  //   const decimated: StockHistoryItem[] = []
  //   const chunks = chunk(result, 10)
  //   chunks.forEach((chunk, i) => {
  //     const isLast = i === chunks.length - 1
  //     decimated.push(!isLast ? chunks[i][0] : chunks[i][chunk.length - 1])
  //   })

  //   return decimated
  // }
}
