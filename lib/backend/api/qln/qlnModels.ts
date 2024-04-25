export interface StockStats {
  TotalUp: number
  TotalDown: number
  TotalUnchanged: number
  TotalUpPercent: number
  TotalDownPercent: number
  TotalUnchangedPercent: number
  MarketDate: string
  DateModified: string
}

export interface MarketHandshake {
  IsOpen: boolean
  MarketsOpenClosedMessage: string
  Message: string
  StockStats: StockStats
}

export type StockReportTypes = 'marketcapleaders' | 'volumeleaders'

export type QlnLineChart = {
  XValues: string[]
  YValues: string[]
  RawData: any
}

export interface EconomicDataItem {
  Title: string
  InternalId: number
  Units: string
  Notes: string
  Value: number
  FirstObservationDate?: string
  LastObservationDate?: string
  Chart: QlnLineChart | null
  criteria?: EconDataCriteria
}

export interface EconDataCriteria {
  id: string
  startYear: number
  endYear: number
}

export interface MovingAvg {
  UnitType: string
  UnitValue: number
  CurrentValue: number
}

export interface SectorIndustry {
  ContainerId: string
  Name: string
  Category: string
  MovingAvg: MovingAvg[]
}
export interface StockDividendItem {
  Symbol: string
  CompanyName: string
  Amount: number
  AnnualYield: number
  ExDate: string | null
  PaymentDate: string
  Frequency: string
}
