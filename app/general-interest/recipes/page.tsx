import { Box } from '@mui/material'
import { getItem, putItem } from 'app/serverActions/aws/dynamo/dynamo'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipesLayout from 'components/Organizms/recipes/RecipesLayout'
import RecipesSearch from 'components/Organizms/recipes/RecipesSearch'
import Seo from 'components/Organizms/Seo'
import dayjs from 'dayjs'
import { SiteStats } from 'lib/backend/api/aws/models/apiGatewayModels'
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
const featuredRecipesExpirationMinutes = 360 // 6 hours

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
  let featured = take(shuffle(allItems), 10)

  const statsRep = await getItem(siteStatsKey)
  const stats = JSON.parse(statsRep.data) as SiteStats
  const now = getUtcNow()
  const expirationDate = dayjs(stats.recipes.lastRefreshDate)
  const needsRefresh = expirationDate.isBefore(now)
  if (needsRefresh) {
    const newStats = { ...stats, recipes: { lastRefreshDate: now.format(), featured: featured } }

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
