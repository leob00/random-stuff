import RecipeLayout from 'components/Organizms/recipes/RecipeLayout'
import { getAllRecipes } from '../page'
import { DropdownItem } from 'lib/models/dropdown'
import { getRecipeTagOptions } from 'lib/backend/api/cms/contenfulApi'
import { sortArray } from 'lib/util/collections'
import { Recipe } from 'lib/models/cms/contentful/recipe'

export async function generateStaticParams() {
  const allRecipes = await getAllRecipes()

  return allRecipes.map((recipe) => ({
    slug: recipe.sys.id,
  }))
}

async function getRecipe(id: string) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe?id=${id}`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })
  const data = (await resp.json()) as Recipe
  return data
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const allRecipes = await getAllRecipes()
  const recipe = await getRecipe(slug)
  const options: DropdownItem[] = allRecipes.map((item) => {
    return { value: item.sys.id, text: item.title }
  })
  const recipeTagOptions = await getRecipeTagOptions(allRecipes)

  let newOptions = [...options, ...recipeTagOptions]
  newOptions = sortArray(newOptions, ['text'], ['asc'])
  const selectedOption = options.find((m) => m.value === recipe.sys.id)

  return <RecipeLayout article={recipe} />
}
