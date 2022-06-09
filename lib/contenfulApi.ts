import axios, { AxiosRequestConfig } from 'axios'
import { BlogCollection, BlogResponse, BlogTypes } from './models/cms/contentful/blog'

const url = `${process.env.CONTENTFUL_GRAPH_BASE_URL}${process.env.CONTENTFUL_SPACE_ID}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`

const allBlogsQuery = `{
  blogCollection {
    items {
      title
      summary
      body
      externalUrl
    }
  }
}
`

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
}

export async function getAllBlogs() {
  //let response = await client.getEntries()
  let body = JSON.stringify({ query: allBlogsQuery })
  let config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  let resp = await axios.post(url, body, config)
  let data = resp.data as BlogResponse
  //console.log(data)
  return data.data.blogCollection

  //return response
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
