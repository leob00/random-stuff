import { StockPosition, StockTransaction, StockTransactionType } from 'lib/backend/api/aws/apiGateway'
import { sum } from 'lodash'

export const usePortfolioCalculator = () => {
  const recalculateTransaction = (position: StockPosition, transaction: StockTransaction) => {
    if (transaction.status === 'open') {
      switch (transaction.type) {
        case 'buy':
          transaction.cost = transaction.quantity * transaction.price
          transaction.value = position.quote!.Price * transaction.quantity
          transaction.gainLoss = transaction.value! - transaction.cost!
          break
        case 'sell short':
          transaction.cost = transaction.quantity * transaction.price
          transaction.value = position.quote!.Price * transaction.quantity
          transaction.gainLoss = transaction.cost! - transaction.value!
          //console.log('sell short')
          break
      }
    } else {
      //TODO
      if (transaction.gainLoss) {
        switch (transaction.type) {
          case 'sell':
        }
      }
    }
  }
  const calculatePositionUnrealizedGainLoss = (position: StockPosition) => {
    if (position.status === 'open') {
      const openTr = position.transactions.filter((m) => m.status === 'open')
      position.unrealizedGainLoss = sum(openTr.map((m) => m.gainLoss))
    }
    //console.log(position.unrealizedGainLoss)
  }

  return {
    recalculateTransaction,
    calculatePositionUnrealizedGainLoss,
  }
}
