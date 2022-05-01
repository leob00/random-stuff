export interface YieldCurveData {
  rows: { yearsToMaturity: number; yield: number }[]
}

export interface BasicArticle {
  type: string
  imagePath?: string
  title: string
  summary?: string
}
