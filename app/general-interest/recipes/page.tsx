import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipesLayout from 'components/Organizms/recipes/RecipesLayout'
import RecipesSearch from 'components/Organizms/recipes/RecipesSearch'
import Seo from 'components/Organizms/Seo'
import { getAllRecipes } from 'lib/backend/api/cms/contenfulApi'
import { Recipe, RecipeCollection } from 'lib/models/cms/contentful/recipe'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import { shuffle, take } from 'lodash'

interface RecipesLayoutModel {
  autoComplete: DropdownItem[]
  featured: Recipe[]
}
export default async function RecipesPage() {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })
  const result = (await resp.json()) as RecipeCollection
  const allItems = result.items
  const featured = take(shuffle(allItems), 10)
  let options: DropdownItem[] = allItems.map((item) => {
    return { value: item.sys.id, text: item.title }
  })
  options = sortArray(options, ['text'], ['asc'])

  const model: RecipesLayoutModel = {
    featured: featured,
    autoComplete: options,
  }

  return (
    <>
      <Seo pageTitle='Recipes' />
      <PageHeader text='Recipes' />

      <Box>
        <CenterStack sx={{ pt: 2 }}>
          <RecipesSearch autoComplete={model.autoComplete} />
        </CenterStack>
        <RecipesLayout featured={model.featured} />
      </Box>
    </>
  )
}
