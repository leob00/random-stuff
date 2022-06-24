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
}
export interface RichText {
  json: Document
}
export interface RecipeCollection {
  featured: Recipe
  topFeatured: Recipe[]
  items: Recipe[]
}

export interface Data {
  recipeCollection: RecipeCollection
  recipe: Recipe
}

export interface RecipesResponse {
  data: Data
}
