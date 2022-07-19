export interface YieldCurveData {
  rows: { yearsToMaturity: number; yield: number }[]
}

export type BasicArticleTypes = 'dogs' | 'cats' | 'DailySilliness'

export interface BasicArticle {
  type: BasicArticleTypes
  imagePath: string
  title: string
  summary?: string
}
