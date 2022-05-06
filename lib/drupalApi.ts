import { DrupalNode } from 'next-drupal'

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
  // to return all fields: remove ?fields= queries at the end of the url

  var resp = await fetch(`${process.env.DUPAL_SITE}node/article/?filter[rules-filter][condition][path]=title&filter[rules-filter][condition][operator]=STARTS_WITH&filter[rules-filter][condition][value]=Rule%20G-&fields[node--article]=id,title,summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let json = await resp.json()
  let allArticles = json.data as DrupalNode[]
  return allArticles
}

export async function getArticle(id: string) {
  //?filter[id]=45bf5891-ddcf-4ac0-be1c-caaba2718621
  var resp = await fetch(`${process.env.DUPAL_SITE}node/article/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let json = await resp.json()

  let result = json.data as DrupalNode
  return result
}
