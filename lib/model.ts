import { DynamoKeys } from './backend/api/aws/apiGateway'

export type BasicArticleTypes = 'dogs' | 'cats' | 'DailySilliness'

export interface BasicArticle {
  type: DynamoKeys | BasicArticleTypes
  imagePath: string
  title: string
  summary?: string
}
