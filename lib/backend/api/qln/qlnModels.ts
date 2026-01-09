export type StockReportTypes = 'marketcapleaders' | 'volumeleaders' | 'indicesAndEtfs' | 'topmvgavg'

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
  Priority?: number | null
  PreviousObservationDate?: string | null
  PreviousValue?: number | null
  Frequency?: string | null
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
