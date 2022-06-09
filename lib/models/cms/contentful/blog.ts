export interface Item {
  title: string
  summary: string
  body: string
  externalUrl: string
  id: number
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
export type BlogTypes = 'blog' | 'news'
