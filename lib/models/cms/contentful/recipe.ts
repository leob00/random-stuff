import { Document } from '@contentful/rich-text-types/dist/types/types'
export interface System {
  id: string
  firstPublishedAt: string
  publishedAt: string
}

export interface HeroImage {
  url: string
  size: number
  height: number
  width: number
}

export interface Recipe {
  sys: System
  title: string
  summary: string
  richBody: RichText
  heroImage: HeroImage
  summaryNotes?: string
}
export interface RichText {
  json: Document
}
export interface RecipeCollection {
  items: Recipe[]
}

export interface RecipeData {
  recipeCollection: RecipeCollection
  recipe: Recipe
}

export interface RecipesResponse {
  data: RecipeData
}
