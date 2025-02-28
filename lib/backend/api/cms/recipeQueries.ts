export const recipeQuery = (id: string) => {
  const result = /* GraphQL */ `{
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
      recipeTagsCollection {
        items {
          id
          name
        }
      }   
  }
}`
  return result
}

export const getAllRecipesQuery = (skip: number) => {
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
      recipeTagsCollection {
        items {
          id
          name
        }
      }       
    }
  }
}`
}
