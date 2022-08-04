import { HeroImage } from './recipe'

export interface BlogItem {
  title: string
  summary: string
  body: string
  externalUrl: string
  id: number
  sys: System
  heroImage: HeroImage
}

export interface BlogCollection {
  items: BlogItem[]
}

export interface Data {
  blogCollection: BlogCollection
}

export interface BlogResponse {
  data: Data
}
export interface System {
  id: string
  firstPublishedAt: string
  publishedAt: string
}
export type BlogTypes = 'blog' | 'news'
