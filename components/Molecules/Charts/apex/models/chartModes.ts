export interface SimpleChartData {
  x: string
  y: number
}

export interface ApexBarChartData extends SimpleChartData {
  fillColor: string
}

export interface XyValues {
  name?: string
  x: string[]
  y: number[]
}
