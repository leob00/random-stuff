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

export type QlnLineChart = {
  XValues: string[]
  YValues: string[]
  RawData: any
}

export interface EconomicDataItem {
  Title: string
  InternalId: string
  Units: string
  Notes: string
  Value: number
  FirstObservationDate?: string
  LastObservationDate?: string
  Chart: QlnLineChart | null
}
