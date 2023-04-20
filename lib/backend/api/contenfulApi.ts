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
  //blogCollection.items = orderBy(blogCollection.items, ['sys.firstPublishedAt'], ['desc'])
  console.log(`retrieved ${blogCollection.items.length} blogs`)
  return blogCollection
}

const getRecipeQuery = (skip: number) => {
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
}`
}

let allRecipes: Recipe[] = []

export async function getAllRecipes() {
  if (allRecipes.length === 0) {
    let firstQuery = getRecipeQuery(0)
    let secondQuery = getRecipeQuery(100)
    let collection1 = await getRecipes(firstQuery)
    let collection2 = await getRecipes(secondQuery)
    let collection = collection1.items
    collection.push(...collection2.items)
    allRecipes = collection
  }

  //const result = orderBy(collection, ['sys.firstPublishedAt'], ['desc'])
  const result: RecipeCollection = {
    items: allRecipes,
  }
  return result
}

const getRecipes = async (query: string) => {
  let body = { query: query }
  let resp = await post(url, body)
  //console.log(resp)
  let data = resp as RecipesResponse
  let collection = data.data.recipeCollection

  console.log(`retrieved ${collection.items.length} recipes`)
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
  console.log(`retrieved ${result.title} recipe id: ${result.sys.id}`)
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
