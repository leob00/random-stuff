import { Box } from '@mui/material'
import { getItem, putItem } from 'app/serverActions/aws/dynamo/dynamo'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipesLayout from 'components/Organizms/recipes/RecipesLayout'
import RecipesSearch from 'components/Organizms/recipes/RecipesSearch'
import dayjs from 'dayjs'
import { SiteStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getRecipeTagOptions } from 'lib/backend/api/cms/contenfulApi'
import { Recipe, RecipeCollection } from 'lib/models/cms/contentful/recipe'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import { getUtcNow } from 'lib/util/dateUtil'
import { shuffle, take } from 'lodash'

interface RecipesLayoutModel {
  autoComplete: DropdownItem[]
  featured: Recipe[]
}
const siteStatsKey = 'site-stats'

export async function getAllRecipes() {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })
  const items = (await resp.json()) as RecipeCollection
  const result = items.items
  return result
}

export default async function RecipesPage() {
  const allItems = await getAllRecipes()
  const statsRep = await getItem(siteStatsKey)
  const stats = JSON.parse(statsRep.data) as SiteStats
  let featured = take(shuffle(allItems), 10)

  const now = getUtcNow()
  let lastRefreshDate = dayjs(stats.recipes.lastRefreshDate)
  const needsRefresh = lastRefreshDate.isBefore(now.subtract(30, 'minutes'))
  if (needsRefresh) {
    const newStats = { ...stats, recipes: { lastRefreshDate: now.format(), featured: featured } }
    console.log(`featured recipes refreshed - date: ${now.format()}`)

    await putItem({
      key: siteStatsKey,
      category: siteStatsKey,
      data: newStats,
      count: 1,
      expiration: 0,
      last_modified: now.format(),
    })
  } else {
    featured = stats.recipes.featured
  }

  let options: DropdownItem[] = allItems.map((item) => {
    return { value: item.sys.id, text: item.title }
  })
  const recipeTagOptions = await getRecipeTagOptions(allItems)

  let newOptions = [...options, ...recipeTagOptions]
  newOptions = sortArray(newOptions, ['text'], ['asc'])
  // options = sortArray(options, ['text'], ['asc'])

  const model: RecipesLayoutModel = {
    featured: featured,
    autoComplete: newOptions,
  }

  return (
    <>
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
