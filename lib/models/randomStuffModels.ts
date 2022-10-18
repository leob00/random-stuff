import { BasicArticle } from 'lib/model'

export interface RandomStuffData {
  cats: BasicArticle[]
  dogs: BasicArticle[]
}

export interface UserNote {
  id?: string
  title: string
  body: string
  dateCreated: string
  dateModified: string
}
