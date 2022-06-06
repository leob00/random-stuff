export interface Item {
  title: string
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
