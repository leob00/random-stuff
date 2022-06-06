import axios, { AxiosRequestConfig } from 'axios'
import { BlogCollection, BlogResponse } from './models/cms/contentful/blog'

const url = `${process.env.CONTENTFUL_GRAPH_BASE_URL}${process.env.CONTENTFUL_SPACE_ID}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`

const query = `query {
  blogCollection {
    items {
      title
    }
  }
}`

export async function getAllBlogs() {
  //let response = await client.getEntries()
  let body = JSON.stringify({ query })
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
