import { StockPosition, StockTransaction, StockTransactionType } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { sum } from 'lodash'

export const usePortfolioCalculator = () => {
  const recalculateTransaction = (position: StockPosition, transaction: StockTransaction) => {
    if (transaction.status === 'open') {
      switch (transaction.type) {
        case 'buy':
          transaction.cost = transaction.quantity * transaction.price * -1
          transaction.value = position.quote!.Price * transaction.quantity
          transaction.gainLoss = transaction.cost! + transaction.value!
          break
        case 'sell short':
          transaction.cost = transaction.quantity * transaction.price
          transaction.value = position.quote!.Price * transaction.quantity
          transaction.gainLoss = transaction.cost! - transaction.value!
          break
      }
    } else {
      // transaction.gainLoss = transaction.cost! - transaction.value!
    }
  }
  const calculatePositionGainLoss = (position: StockPosition) => {
    if (position.status === 'open') {
      const openTr = position.transactions.filter((m) => m.status === 'open')
      position.unrealizedGainLoss = sum(openTr.map((m) => m.gainLoss))
      position.openQuantity = sum(openTr.map((m) => m.quantity))
    }
    const closedTr = position.transactions.filter((m) => m.status === 'closed')
    position.realizedGainLoss = sum(closedTr.map((m) => m.gainLoss))

    //todo: calculate realized gain loss
  }

  return {
    recalculateTransaction,
    calculatePositionGainLoss: calculatePositionGainLoss,
  }
}
