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
export interface RecipeTag {
  name: string
}

interface RecipeTagsCollection {
  items: RecipeTag[]
}

export interface Recipe {
  sys: System
  title: string
  summary: string | null
  richBody: RichText
  heroImage: HeroImage
  summaryNotes?: string
  recipeTagsCollection: RecipeTagsCollection
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
