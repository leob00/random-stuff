import { DrupalFileMeta, DrupalNode, JsonApiResponse } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ArticlesModel, DrupalArticle } from './model'

export async function getAllArticles() {
  var resp = await fetch('https://dev-devtest00.pantheonsite.io/jsonapi/node/article/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let json = await resp.json()
  let allArticles = json.data as DrupalNode[]
  return allArticles
}

export async function getRules() {
  const apiParams = new DrupalJsonApiParams()
  apiParams.addFilter('title', 'Rule%20G', 'STARTS_WITH')
  apiParams.addFields('node--article', ['id', 'title']).addSort('title')
  let drupalSite = process.env.DUPAL_SITE
  let url = `${drupalSite}node/article/?${apiParams.getQueryString({ encode: false })}`
  var resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let json = await resp.json()
  let allArticles = json.data as DrupalNode[]
  return allArticles
}

export async function getRecipes() {
  const apiParams = new DrupalJsonApiParams()
  apiParams.addFilter('title', 'Recipe', 'STARTS_WITH')
  apiParams.addFields('node--article', ['id', 'title']).addSort('title')
  let drupalSite = process.env.DUPAL_SITE
  let queryString = apiParams.getQueryString({ encode: false })
  let url = `${drupalSite}node/article/?${queryString}`

  let result: ArticlesModel = {
    allArticles,
  }
  if (json.links) {
    let nextUrl = json.links.nextUrl
  }
  return result
}

export async function getDrupalData(url: string): Promise<DrupalNode[]> {
  let result: DrupalNode[] = []
  console.log('drupal url: ' + url)
  var resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let json = (await resp.json()) as JsonApiResponse
  let allArticles = json.data as DrupalNode[]
  return result
}

export async function getArticle(id: string) {
  const apiParams = new DrupalJsonApiParams()
  apiParams.addInclude(['field_image'])
  apiParams.addFields('file--file', ['uri', 'url'])
  let queryString = apiParams.getQueryString()
  const drupalSite = process.env.DUPAL_SITE
  let url = `${drupalSite}node/article/${id}?${queryString}`

  var resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let json = await resp.json()
  let result = (await json.data) as DrupalNode
  return result
}

export async function getDrupalArticle(id: string) {
  const apiParams = new DrupalJsonApiParams()
  apiParams.addInclude(['field_image'])
  apiParams.addFields('file--file', ['uri', 'url'])
  let queryString = apiParams.getQueryString()
  const drupalSite = process.env.DUPAL_SITE
  let url = `${drupalSite}node/article/${id}?${queryString}`

  var resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let json = await resp.json()
  let drupalResp = json as JsonApiResponse
  let result = json.data as DrupalArticle
  if (drupalResp.included) {
    let arr = drupalResp.included as DrupalNode[]
    if (arr.length > 0) {
      let included = arr[0]
      if (result.relationships) {
        let fileMeta = result.relationships.field_image.data.meta as DrupalFileMeta
        result.fileMeta = fileMeta
      }

      //sconsole.log(JSON.stringify(included.attributes.uri))
      result.imageUrl = `${process.env.DUPAL_BASE_URL}${included.attributes.uri.url}`
    }
  }

  return result
}
