import { StockPosition, StockTransaction, StockTransactionType } from 'lib/backend/api/aws/apiGateway'
import { sum } from 'lodash'

export const usePortfolioCalculator = () => {
  // let oppositeType: StockTransactionType

  const calculateTransactionGainLoss = (position: StockPosition, transaction: StockTransaction) => {
    if (transaction.status !== 'closed') {
      switch (transaction.type) {
        case 'buy':
          return position.quote!.Price * transaction.quantity - transaction.price * transaction.quantity
        case 'sell short':
          return transaction.price * transaction.quantity - position.quote!.Price * transaction.quantity
      }
    } else {
      //TODO
      if (transaction.gainLoss) {
        switch (transaction.type) {
          case 'sell':
        }
      }
    }
    return undefined
  }
  const calculatePositionUnrealizedGainLoss = (position: StockPosition) => {
    let unrealizedGainLoss = position.unrealizedGainLoss
    if (position.status === 'open') {
      const buyTotals = position.transactions
        .filter((m) => !m.isClosing && m.type === 'buy')
        .map((t) => {
          return { spent: t.price * t.quantity, currentValue: position.quote!.Price * t.quantity }
        })
      unrealizedGainLoss = sum(buyTotals.map((m) => m.currentValue)) - sum(buyTotals.map((m) => m.spent))
    }
    return unrealizedGainLoss
  }

  return {
    calculateTransactionGainLoss,
    calculatePositionUnrealizedGainLoss,
  }
}
