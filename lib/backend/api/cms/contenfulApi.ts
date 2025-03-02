import { sleep } from 'lib/util/timers'
import { BlogResponse, BlogTypes } from '../../../models/cms/contentful/blog'
import { Recipe, RecipeCollection, RecipeTag, RecipesResponse } from '../../../models/cms/contentful/recipe'
import { apiConnection } from '../config'
import { post } from '../fetchFunctions'
import { getAllRecipesQuery, recipeQuery } from './recipeQueries'
import { getItem, putItem } from 'app/serverActions/aws/dynamo/dynamo'
import { SiteStats } from '../aws/models/apiGatewayModels'
import dayjs from 'dayjs'
import { getUtcNow } from 'lib/util/dateUtil'
import { DropdownItem } from 'lib/models/dropdown'

const config = apiConnection().contentful

const url = `${config.url}${config.spaceId}?access_token=${config.key}`

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

export async function getAllBlogs() {
  let body = { query: allBlogsQuery }

  let resp = await post(url, body)
  let data = resp as BlogResponse
  let blogCollection = data.data.blogCollection
  return blogCollection
}

const recipesMap = new Map<string, Recipe>()

export async function getAllRecipes(): Promise<RecipeCollection> {
  if (recipesMap.size > 0) {
    return {
      items: Array.from(recipesMap.values()),
    }
  }
  for (let index = 0; index < 50; index++) {
    const result = await getRecipes(getAllRecipesQuery(index * 100))
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
export async function getRecipeTagOptions(recipes: Recipe[]) {
  const itemsWithTags = recipes.filter((m) => m.recipeTagsCollection.items.length > 0).flatMap((t) => t.recipeTagsCollection.items)
  const tagMap = new Map<string, RecipeTag>()
  itemsWithTags.forEach((tag) => {
    if (tag.id) {
      tagMap.set(tag.id, tag)
    }
  })
  const result: DropdownItem[] = Array.from(tagMap.values()).map((m) => {
    return {
      text: m.name,
      value: `tag:${m.id}`,
    }
  })

  return result
}

export async function getFeaturedRecipes(existingFeatured: Recipe[]) {
  const siteStatsKey = 'site-stats'
  const featuredRecipesExpirationMinutes = 720 // 12 hours

  const statsRep = await getItem(siteStatsKey)
  const stats = JSON.parse(statsRep.data) as SiteStats
  const needsRefresh = dayjs(stats.recipes.lastRefreshDate).add(featuredRecipesExpirationMinutes, 'minute').isBefore(dayjs())
  if (needsRefresh) {
    stats.recipes.featured = [...existingFeatured]
    stats.recipes.lastRefreshDate = dayjs().format()
    await putItem({
      key: siteStatsKey,
      category: siteStatsKey,
      data: stats,
      count: 1,
      expiration: 0,
      last_modified: getUtcNow().format(),
    })
  }
  const featured = needsRefresh ? existingFeatured : stats.recipes.featured
  return featured
}

const getRecipes = async (query: string) => {
  let body = { query: query }
  const resp = await post(url, body)

  const data = resp as RecipesResponse
  const collection = data.data.recipeCollection
  await sleep(250)
  return collection
}

export async function getRecipe(id: string) {
  const body = { query: recipeQuery(id) }
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
