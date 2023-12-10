import { BlogResponse, BlogTypes } from '../../models/cms/contentful/blog'
import { Recipe, RecipeCollection, RecipesResponse } from '../../models/cms/contentful/recipe'
import { post } from './fetchFunctions'

const url = `${process.env.CONTENTFUL_GRAPH_BASE_URL}${process.env.CONTENTFUL_SPACE_ID}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`

const allBlogsQuery = /* GraphQL */ `
  {
    blogCollection {
      items {
        id
        title
        summary
        body
        externalUrl
        sys {
          id
          firstPublishedAt
          publishedAt
        }
        heroImage {
          url
          size
          height
          width
        }
      }
    }
  }
`
const allRecipesQuery = /* GraphQL */ `
  {
    recipeCollection {
      items {
        sys {
          id
          firstPublishedAt
          publishedAt
        }
        title
        summary
        richBody {
          json
        }
        heroImage {
          url
          size
          height
          width
        }
      }
    }
  }
`

export async function getAllBlogs() {
  let body = { query: allBlogsQuery }

  let resp = await post(url, body)
  let data = resp as BlogResponse
  let blogCollection = data.data.blogCollection
  return blogCollection
}

const getRecipesQuery = (skip: number) => {
  return /* GraphQL */ `{
  recipeCollection (skip: ${skip}) {
    items {
      sys {
        id
        firstPublishedAt
        publishedAt
      }      
      title
      summary      
      heroImage {
        url
        size
        height
        width
      }
    
    }
  }
}`
}

const recipesMap = new Map<string, Recipe>()

export async function getAllRecipes(): Promise<RecipeCollection> {
  if (recipesMap.size > 0) {
    return {
      items: Array.from(recipesMap.values()),
    }
  }
  for (let index = 0; index < 50; index++) {
    const result = await getRecipes(getRecipesQuery(index * 100))
    result.items.forEach((item) => {
      recipesMap.set(item.sys.id, item)
    })
    if (result.items.length === 0) {
      break
    }
  }
  const result: RecipeCollection = {
    items: Array.from(recipesMap.values()),
  }
  return result
}

const getRecipes = async (query: string) => {
  let body = { query: query }
  let resp = await post(url, body)
  let data = resp as RecipesResponse
  let collection = data.data.recipeCollection

  return collection
}

export async function getRecipe(id: string) {
  const query = /* GraphQL */ `{
  recipe(id: "${id}") {    
      sys {
        id
        firstPublishedAt
        publishedAt
      }      
      title
      summary
      summaryNotes
      richBody {
        json
      }
      heroImage {
        url
        size
        height
        width
      }
  }
}`
  let body = { query: query }

  const resp = await post(url, body)
  const data = resp as RecipesResponse
  const result = data.data.recipe
  return result
}

export async function getBlogsByType(type: BlogTypes) {
  const query = /* GraphQL */ `query {
    yieldCurveCollection(where: {
        id: "${type}"
    }) {
        items  {
        id
        title
        summary
        disclaimer
        logo {
            url
            }
        }
    }
}`
  let body = { query }
  let resp = await post(url, body)
  let data = (await resp) as BlogResponse
  return data.data.blogCollection.items[0]
}
