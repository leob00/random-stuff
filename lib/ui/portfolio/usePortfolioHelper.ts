import { PositionFields } from 'components/Molecules/Forms/Stocks/AddPositionForm'
import { PorfolioFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import { TransactionFields } from 'components/Organizms/stocks/portfolio/AddTransactionForm'
import { StockPortfolio, StockPosition, StockPositionType, StockTransaction, StockTransactionType } from 'lib/backend/api/aws/apiGateway'
import { constructDynamoKey, constructStockPositionSecondaryKey } from 'lib/backend/api/aws/util'
import { post } from 'lib/backend/api/fetchFunctions'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPorfolioIdFromKey, getUsernameFromKey } from 'lib/backend/api/portfolioUtil'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { deleteRecord, putRecord, searchRecords } from 'lib/backend/csr/nextApiWrapper'
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
  const { recalculateTransaction, calculatePositionUnrealizedGainLoss } = usePortfolioCalculator()

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
      pos.openQuantity = sum(pos.transactions.filter((t) => t.status === 'open').map((m) => m.quantity))
      recalculateTransaction(pos, newTransaction)
      calculatePositionUnrealizedGainLoss(pos)
      await updatePosition(pos)
    } else {
      existingPos.transactions.push(newTransaction)
      existingPos.openQuantity = sum(existingPos.transactions.filter((t) => t.status === 'open').map((m) => m.quantity))
      recalculateTransaction(pos, newTransaction)
      calculatePositionUnrealizedGainLoss(pos)
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

    records.forEach((position, positionIx) => {
      if (newMap.has(position.stockSymbol)) {
        position.quote = newMap.get(position.stockSymbol)
        position.transactions = sortArray(position.transactions, ['date'], ['desc'])
        position.transactions.forEach((transaction, i) => {
          transaction.status = transaction.isClosing ? 'closed' : 'open'
          recalculateTransaction(position, transaction)
          position.transactions[i] = transaction
        })
        calculatePositionUnrealizedGainLoss(position)
        records[positionIx] = position
      }
    })
    const unrealizedGainLoss = sum(records.map((p) => p.unrealizedGainLoss))
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
      case 'sell':
        return 'buy'
      case 'buy to cover':
        return 'sell short'
    }
    return type
  }

  const addTransaction = async (position: StockPosition, tr: StockTransaction) => {
    const result: Validation = {
      isValid: true,
      messages: [],
    }

    tr.isClosing = tr.type === 'sell' || tr.type === 'buy to cover'
    tr.status = tr.type === 'sell' || tr.type === 'buy to cover' ? 'closed' : 'open'
    if (tr.status === 'open') {
      position.transactions.push(tr)
      position.openQuantity = sum(position.transactions.filter((m) => !m.isClosing).map((t) => t.quantity))
      await updatePosition(position)
      return result
    }
    const oppositeType = getOppositeTransactionType(tr.type)
    if (tr.status === 'closed') {
      if (tr.quantity > position.openQuantity) {
        result.isValid = false
        result.messages.push(`Please make sure the ${tr.type} quantity does not exceed ${oppositeType} quantity.`)
      }
      return result
    }
    //recalculateTransaction(position, tr)

    if (tr.type === 'sell' || tr.type === 'buy to cover') {
      const openTransactions = position.transactions.filter((m) => m.status === 'open' && m.type === oppositeType)
      //const openQuantity =
    }

    return result
  }

  const saveTransaction = async (pos: StockPosition, tr: StockTransaction) => {
    const newTransactions = pos.transactions.filter((m) => m.id !== tr.id)
    newTransactions.push(tr)
    pos.transactions = newTransactions
    pos.openQuantity = sum(newTransactions.filter((m) => !m.isClosing).map((t) => t.quantity))
    await updatePosition(pos)
  }
  const deletePosition = async (pos: StockPosition) => {
    await deleteRecord(pos.id)
  }

  return {
    addPosition,
    loadPositions,
    updatePosition,
    savePortfolio,
    saveTransaction,
    addTransaction,
    deletePosition,
  }
}
