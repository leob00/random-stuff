import { PositionFields } from 'components/Molecules/Forms/Stocks/AddPositionForm'
import { PorfolioFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import { TransactionFields } from 'components/Organizms/stocks/portfolio/AddTransactionForm'
import { StockPortfolio, StockPosition, StockPositionType, StockTransaction, StockTransactionType } from 'lib/backend/api/aws/apiGateway'
import { constructDynamoKey, constructStockPositionSecondaryKey } from 'lib/backend/api/aws/util'
import { post } from 'lib/backend/api/fetchFunctions'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPorfolioIdFromKey, getUsernameFromKey } from 'lib/backend/api/portfolioUtil'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { putRecord, searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { sum } from 'lodash'
import React from 'react'
import { usePortfolioCalculator } from './usePortfolioCalculator'

export interface Validation {
  isValid: boolean
  messages: string[]
}

export const usePortfolioHelper = (portfolio: StockPortfolio) => {
  const username = getUsernameFromKey(portfolio.id)
  const portfolioId = getPorfolioIdFromKey(portfolio.id)
  const [positions, setPostions] = React.useState<StockPosition[]>([])
  const { calculateTransactionGainLoss, calculatePositionUnrealizedGainLoss } = usePortfolioCalculator()

  const addPosition = async (data: PositionFields, position: StockPosition) => {
    const username = getUsernameFromKey(portfolio.id)
    const portfolioId = getPorfolioIdFromKey(portfolio.id)
    const pos = { ...position }
    if (!pos.id) {
      pos.id = `${constructStockPositionSecondaryKey(username, portfolioId)}[${crypto.randomUUID()}]`
    }
    pos.portfolioId = portfolio.id
    pos.stockSymbol = data.symbol
    pos.type = data.type as StockPositionType
    pos.date = data.date

    const newTransaction: StockTransaction = {
      id: crypto.randomUUID(),
      positionId: pos.id,
      price: Number(data.price),
      quantity: data.quantity,
      type: pos.type === 'long' ? 'buy' : 'sell short',
      date: pos.date,
      status: 'open',
      cost: Number(data.price) * data.quantity,
    }

    const existingPos = positions.find((m) => m.status === 'open' && m.type === pos.type && m.stockSymbol === pos.stockSymbol)
    if (!existingPos) {
      pos.transactions.push(newTransaction)
      pos.openQuantity = sum(pos.transactions.map((m) => m.quantity))
      await updatePosition(pos)
    } else {
      existingPos.transactions.push(newTransaction)
      existingPos.openQuantity = sum(existingPos.transactions.map((m) => m.quantity))
      await updatePosition(existingPos)
    }
  }

  const updatePosition = async (position: StockPosition) => {
    const secKey = constructStockPositionSecondaryKey(username, portfolioId)
    await putRecord(position.id, secKey, position)
  }

  const loadPositions = async () => {
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
        position.unrealizedGainLoss = calculatePositionUnrealizedGainLoss(position)
        position.transactions = sortArray(position.transactions, ['date'], ['desc'])
        position.transactions.forEach((transaction) => {
          if (!transaction.status) {
            transaction.status = 'open'
          }
          if (!transaction.cost) {
            transaction.cost = transaction.price * transaction.quantity
          }
          transaction.gainLoss = calculateTransactionGainLoss(position, transaction)
        })
      }
    })
    const unrealizedGainLoss = sum(records.filter((m) => m.unrealizedGainLoss).map((p) => p.unrealizedGainLoss))
    if (unrealizedGainLoss !== portfolio.gainLoss) {
      portfolio.gainLoss = unrealizedGainLoss
      savePortfolio(portfolio)
    }
    setPostions(records)
    return records
  }

  const savePortfolio = async (portfolio: StockPortfolio) => {
    const secKey = constructDynamoKey('stockportfolio', username)
    await putRecord(portfolio.id, secKey, portfolio)
  }
  const getOppositeTransactionType = (type: StockTransactionType): StockTransactionType => {
    switch (type) {
      case 'buy':
        return 'sell'
      case 'sell short':
        return 'buy to cover'
    }
    return type
  }

  const addTransaction = async (position: StockPosition, fields: TransactionFields) => {
    const tr: StockTransaction = {
      id: crypto.randomUUID(),
      positionId: position.id,
      quantity: fields.quantity,
      type: fields.type as StockTransactionType,
      cost: Number(fields.price) * fields.quantity,
      date: fields.date,
      price: Number(fields.price),
      status: 'open',
    }
    tr.isClosing = tr.type === 'sell' || tr.type === 'buy to cover'
    tr.gainLoss = calculateTransactionGainLoss(position, tr)
    const result: Validation = {
      isValid: true,
      messages: [],
    }
    if (tr.type === 'sell' || tr.type === 'buy to cover') {
      const oppositeType = getOppositeTransactionType(tr.type)
      const openTransactions = position.transactions.filter((m) => m.status === 'open' && m.type === oppositeType)
      //const openQuantity =
    }

    return result
  }

  return {
    addPosition,
    loadPositions,
    updatePosition,
    savePortfolio,
  }
}
