import { PositionFields } from 'components/Molecules/Forms/Stocks/EditPositionForm'
import { StockPortfolio, StockPosition, StockPositionType } from 'lib/backend/api/aws/apiGateway'
import { constructStockPositionSecondaryKey } from 'lib/backend/api/aws/util'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPorfolioIdFromKey, getUsernameFromKey } from 'lib/backend/api/portfolioUtil'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { putRecord, searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { getMapFromArray } from 'lib/util/collectionsNative'
import React from 'react'

export const usePortfolioHelper = (portfolio: StockPortfolio) => {
  const [stockMap, setStockMap] = React.useState(new Map<string, StockQuote>())

  const savePosition = async (data: PositionFields, position: StockPosition) => {
    const username = getUsernameFromKey(portfolio.id)
    const portfolioId = getPorfolioIdFromKey(portfolio.id)
    const pos = { ...position }
    if (!pos.id) {
      pos.id = `${constructStockPositionSecondaryKey(username, portfolio.id)}[${crypto.randomUUID()}]`
    }

    pos.portfolioId = portfolio.id
    pos.stockSymbol = data.symbol
    pos.type = data.type as StockPositionType
    pos.date = data.date
    pos.openQuantity = data.quantity
    const secKey = constructStockPositionSecondaryKey(username, portfolioId)
    await putRecord(pos.id, secKey, pos)
  }

  const loadPositions = async () => {
    const username = getUsernameFromKey(portfolio.id)
    const portfolioId = getPorfolioIdFromKey(portfolio.id)
    const searchKey = constructStockPositionSecondaryKey(username, portfolioId)
    const records = (await searchRecords(searchKey)).map((m) => JSON.parse(m.data) as StockPosition)
    const symbols = new Set(records.map((m) => m.stockSymbol))
    const newMap = new Map(stockMap)
    const toDownload = new Set(symbols)
    toDownload.clear()
    symbols.forEach((symbol) => {
      if (!newMap.has(symbol)) {
        toDownload.add(symbol)
      }
    })
    const quotes = await getStockQuotes(Array.from(toDownload))
    quotes.forEach((quote) => {
      newMap.set(quote.Symbol, quote)
    })

    records.forEach((position) => {
      if (newMap.has(position.stockSymbol)) {
        position.quote = newMap.get(position.stockSymbol)
      }
    })
    setStockMap(newMap)

    return records
  }

  return {
    savePosition: savePosition,
    loadPositions: loadPositions,
  }
}
