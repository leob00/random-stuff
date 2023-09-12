import { PositionFields } from 'components/Molecules/Forms/Stocks/AddPositionForm'
import { StockPortfolio, StockPosition, StockPositionType } from 'lib/backend/api/aws/apiGateway'
import { constructStockPositionSecondaryKey } from 'lib/backend/api/aws/util'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPorfolioIdFromKey, getUsernameFromKey } from 'lib/backend/api/portfolioUtil'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { putRecord, searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { sum } from 'lodash'
import React from 'react'

export const usePortfolioHelper = (portfolio: StockPortfolio) => {
  const addPosition = async (data: PositionFields, position: StockPosition) => {
    const username = getUsernameFromKey(portfolio.id)
    const portfolioId = getPorfolioIdFromKey(portfolio.id)
    const pos = { ...position }
    if (!pos.id) {
      pos.id = `${constructStockPositionSecondaryKey(username, portfolioId)}[${crypto.randomUUID()}]`
    }
    if (pos.transactions.length === 0) {
      pos.transactions.push({
        id: crypto.randomUUID(),
        positionId: pos.id,
        price: Number(data.price),
        quantity: data.quantity,
        type: pos.type === 'long' ? 'buy' : 'sell short',
      })
    }

    pos.portfolioId = portfolio.id
    pos.stockSymbol = data.symbol
    pos.type = data.type as StockPositionType
    pos.date = data.date
    pos.openQuantity = sum(pos.transactions.map((m) => m.quantity))
    const secKey = constructStockPositionSecondaryKey(username, portfolioId)
    await putRecord(pos.id, secKey, pos)
  }

  const updatePosition = async (position: StockPosition) => {
    const username = getUsernameFromKey(portfolio.id)
    const portfolioId = getPorfolioIdFromKey(portfolio.id)
    const secKey = constructStockPositionSecondaryKey(username, portfolioId)
    await putRecord(position.id, secKey, position)
  }

  const loadPositions = async () => {
    const username = getUsernameFromKey(portfolio.id)
    const portfolioId = getPorfolioIdFromKey(portfolio.id)
    const searchKey = constructStockPositionSecondaryKey(username, portfolioId)
    const records = (await searchRecords(searchKey)).map((m) => JSON.parse(m.data) as StockPosition)

    const symbols = new Set(records.map((m) => m.stockSymbol))
    const newMap = new Map<string, StockQuote>()
    const symbolsToDownload = Array.from(symbols)

    const quotes: StockQuote[] = symbolsToDownload.length > 0 ? await getStockQuotes(Array.from(symbols)) : []
    quotes.forEach((quote) => {
      newMap.set(quote.Symbol, quote)
    })

    records.forEach((position) => {
      if (newMap.has(position.stockSymbol)) {
        position.quote = newMap.get(position.stockSymbol)
      }
    })

    return records
  }

  return {
    addPosition,
    loadPositions,
    updatePosition,
  }
}
