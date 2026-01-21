import { getRecipeTagOptions } from 'lib/backend/api/cms/contenfulApi'
import { sortArray } from 'lib/util/collections'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getAllRecipes } from 'app/general-interest/recipes/page'
import RecipeTagsLayout from '../RecipeTagsLayout'
import { uniq } from 'lodash'

export async function generateStaticParams() {
  const allRecipes = await getAllRecipes()
  const filtered = allRecipes.filter((m) => m.recipeTagsCollection.items.length > 0)
  const tagOptions = uniq(filtered.flatMap((m) => m.recipeTagsCollection.items.map((t) => t.name)))
  //const tagIds = new Set(filtered.flatMap((m) => m.recipeTagsCollection.items.map((t) => t.id))).values()

  return tagOptions.map((tag) => ({
    slug: tag,
  }))
}

async function getRecipiesFiltered() {
  const allRecipes = await getAllRecipes()
  const filtered = allRecipes.filter((m) => m.recipeTagsCollection.items.length > 0)

  return filtered
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const filtered = await getRecipiesFiltered()
  const tags = await getRecipeTagOptions(filtered)
  const tag = tags.find((m) => m.value == `tag:${slug}`)
  const result: Recipe[] = []
  filtered.forEach((m) => {
    if (m.recipeTagsCollection.items.some((t) => t.id === slug)) {
      result.push({ ...m })
    }
  })

  const allTags = sortArray(tags, ['text'], ['asc'])

  return (
    <>
      <PageHeader text={tag ? `Recipe Category: ${tag.text}` : ''} backButtonRoute='/general-interest/recipes' />
      <RecipeTagsLayout tag={slug} filteredRecipes={result} allTags={allTags} />
    </>
  )
}
