export interface MarketHandshake {
  IsOpen: boolean
  MarketsOpenClosedMessage: string
  Message: string
  StockStats: {
    TotalUp: number
    TotalDown: number
    TotalUnchanged: number
    TotalUpPercent: number
    TotalDownPercent: number
    TotalUnchangedPercent: number
    MarketDate: string
    DateModified: string
  }
}

export type StockReportTypes = 'marketcapleaders' | 'volumeleaders'
