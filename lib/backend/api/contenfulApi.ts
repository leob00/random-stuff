import axios, { AxiosRequestConfig } from 'axios'
import { cloneDeep, orderBy } from 'lodash'
import { BlogResponse, BlogTypes } from '../../models/cms/contentful/blog'
import { RecipeCollection, RecipesResponse } from '../../models/cms/contentful/recipe'

const url = `${process.env.CONTENTFUL_GRAPH_BASE_URL}${process.env.CONTENTFUL_SPACE_ID}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`

const allBlogsQuery = `{
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
const allRecipesQuery = `{
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
}`

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
}

export async function getAllBlogs() {
  let body = JSON.stringify({ query: allBlogsQuery })
  let config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  let resp = await axios.post(url, body, config)
  let data = resp.data as BlogResponse
  let blogCollection = data.data.blogCollection
  blogCollection.items = orderBy(blogCollection.items, ['sys.firstPublishedAt'], ['desc'])
  console.log(`retrieved ${blogCollection.items.length} blogs`)
  return blogCollection
}

const getRecipeQuery = (skip: number) => {
  return `{
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

export async function getAllRecipes() {
  let firstQuery = getRecipeQuery(0)
  let secondQuery = getRecipeQuery(100)

  let collection1 = await getRecipes(firstQuery)
  let collection2 = await getRecipes(secondQuery)
  let collection = collection1.items
  collection.push(...collection2.items)
  const result = orderBy(collection, ['sys.firstPublishedAt'], ['desc'])
  let coll: RecipeCollection = {
    items: result,
  }
  return coll
}

const getRecipes = async (query: string) => {
  let body = JSON.stringify({ query: query })
  let config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  let resp = await axios.post(url, body, config)
  let data = resp.data as RecipesResponse
  let collection = data.data.recipeCollection

  console.log(`retrieved ${collection.items.length} recipes`)
  return collection
}

export async function getRecipe(id: string) {
  const query = `{
  recipe(id: "${id}") {    
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
}`
  let body = JSON.stringify({ query: query })
  let config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  let resp = await axios.post(url, body, config)
  let data = resp.data as RecipesResponse
  let result = data.data.recipe
  console.log(`retrieved ${result.title} recipe: ${result.sys.id}`)
  return result
}

export async function getBlogsByType(type: BlogTypes) {
  const query = `query {
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
  let body = JSON.stringify({ query })
  let resp = await axios.post(url, body, config)
  let data = (await resp.data) as BlogResponse
  return data.data.blogCollection.items[0]
}
