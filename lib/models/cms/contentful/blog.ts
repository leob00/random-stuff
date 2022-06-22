import { HeroImage } from './recipe'

export interface Item {
  title: string
  summary: string
  body: string
  externalUrl: string
  id: number
  sys: System
  heroImage: HeroImage
}

export interface BlogCollection {
  items: Item[]
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
