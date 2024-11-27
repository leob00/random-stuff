import { Recipe } from 'lib/models/cms/contentful/recipe'
import { DropdownItem } from 'lib/models/dropdown'

export interface PresignedUrlPost {
  url: string
  fields: {
    'Content-Type': string
    key: string
    AWSAccessKeyId: string
    'x-amz-security-token': string
    policy: string
    signature: string
  }
}
export type Bucket = 'rs-files'

export type DynamoKeys =
  | 'dogs'
  | 'cats'
  | 'coinflip-community'
  | 'wheelspin-community'
  | 'site-stats'
  | 'community-stocks'
  | 'user-stock_list'
  | 'stockportfolio'
  | 'email-template[stock-alert]'
  | 'stocks-daily-market-sentiment'
  | 'stocks-monthly-market-sentiment'

export type CategoryType = 'animals' | 'random' | 'userProfile' | 'community-stocks' | 'searched-stocks' | 'user-stock_list' | string

export interface S3Object {
  bucket: Bucket
  prefix: string
  filename: string
  isFolder?: boolean
  size?: number
  message?: string
  fullPath: string
}

export interface UserStockSettings {
  defaultView?: 'flat' | 'grouped'
  customSort?: Sort[]
  sort?: {
    grouped: {
      main: Sort[]
      inside: Sort[]
    }
  }
  earnings?: {
    display: 'table' | 'chart'
  }
}

export interface UserSettings {
  news?: {
    lastNewsType?: string
  }
  stocks?: UserStockSettings
  folders?: DropdownItem[]
  selectedFolder?: DropdownItem
}

export interface UserProfile {
  id: string
  username: string
  secKey?: string
  pin?: UserPin
  emailVerified?: boolean
  settings?: UserSettings
}

export interface UserPin {
  pin: string
  lastEnterDate: string
}
export type SortDirection = 'asc' | 'desc'

export type Sort = {
  key: string
  direction: 'asc' | 'desc'
}

export interface SiteStats {
  recipes: {
    lastRefreshDate: string
    featured: Recipe[]
  }
}

export interface RandomStuffPut {
  key: DynamoKeys | string
  data: BasicArticle[] | CoinFlipStats
  category: CategoryType
  expiration?: number
}

export interface LambdaDynamoRequest {
  id: string
  category: CategoryType | string
  data: any
  expiration: number
  token?: string
}

export interface LambdaDynamoRequestBatch {
  records: LambdaDynamoRequest[]
}

export interface LambdaResponse {
  statusCode: number
  body: LambdaBody
}
export interface LambdaListResponse {
  statusCode: number
  body: LambdaBody[]
}
export interface LambdaBody {
  count?: number
  key?: string
  category?: string
  data: string
  last_modified?: string
  expiration?: number
}

export interface CoinFlipStats {
  heads: number
  tails: number
}
export interface WheelSpinStats {
  total: number
  red: number
  black: number
  zero: number
  doubleZero: number
  odd: number
  even: number
}

export type BasicArticleTypes = 'dogs' | 'cats' | 'DailySilliness'

export interface BasicArticle {
  type: DynamoKeys | BasicArticleTypes
  imagePath: string
  title: string
  summary?: string
}

export interface EmailMessage {
  to: string
  subject: string
  html: string
}

export interface RandomStuffData {
  cats: BasicArticle[]
  dogs: BasicArticle[]
}

type ShareableLink = {
  url: string
  token: string
}

export type UserNoteShare = {
  viewLink?: ShareableLink
  editLink?: ShareableLink
}

export interface UserNote {
  id?: string
  title: string
  body: string
  dateCreated: string
  dateModified: string
  expirationDate?: string
  attachments?: S3Object[]
  share?: UserNoteShare
}
