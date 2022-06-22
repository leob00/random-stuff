import { DrupalFile, DrupalFileMeta, DrupalNode } from 'next-drupal'

export interface YieldCurveData {
  rows: { yearsToMaturity: number; yield: number }[]
}

export interface BasicArticle {
  type: string
  imagePath: string
  title: string
  summary?: string
}

export interface DrupalArticle extends DrupalNode {
  file?: DrupalNode
  imageUrl?: string
  fileMeta?: DrupalFileMeta
  summary: string
}

export interface ArticlesModel {
  featured?: DrupalArticle
  allArticles: DrupalNode[]
}
