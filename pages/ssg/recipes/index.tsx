import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import { getAllRecipes, getFeaturedRecipes, getRecipeTagOptions } from 'lib/backend/api/cms/contenfulApi'
import { shuffle, take } from 'lodash'
import { Recipe, RecipeCollection } from 'lib/models/cms/contentful/recipe'
import RecipesLayout from 'components/Organizms/recipes/RecipesLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { SiteStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Seo from 'components/Organizms/Seo'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getItem, putItem } from 'app/serverActions/aws/dynamo/dynamo'
import { getUtcNow } from 'lib/util/dateUtil'
import CenterStack from 'components/Atoms/CenterStack'
import RecipesSearch from 'components/Organizms/recipes/RecipesSearch'
import { getRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
dayjs.extend(relativeTime)

const cmsRefreshIntervalSeconds = 21600 // 6 hours
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000
const featuredLength = 10
const siteStatsKey = 'site-stats'
const featuredRecipesExpirationMinutes = 360 // 6 hours

interface RecipesLayoutModel {
  autoComplete: DropdownItem[]
  featured: Recipe[]
}

const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  const result = resp.data as RecipeCollection
  const allItems = result.items

  const newData = take(shuffle(allItems), featuredLength)
  const stats = await getRecord<SiteStats>(siteStatsKey)

  const now = getUtcNow()
  const expirationDate = now.add(featuredRecipesExpirationMinutes, 'minute')
  const needsRefresh = expirationDate.isBefore(now)
  if (needsRefresh) {
    stats.recipes.featured = newData
    stats.recipes.lastRefreshDate = now.format()
    await putRecord(siteStatsKey, siteStatsKey, stats)
  }
  const featured = needsRefresh ? newData : stats.recipes.featured

  let options: DropdownItem[] = allItems.map((item) => {
    return { value: item.sys.id, text: item.title }
  })
  options = sortArray(options, ['text'], ['asc'])

  const model: RecipesLayoutModel = {
    featured: featured,
    autoComplete: options,
  }
  return model
}

export const getStaticProps: GetStaticProps = async (context) => {
  const result = await getAllRecipes()
  const newData = take(shuffle(result.items), featuredLength)

  const statsRep = await getItem(siteStatsKey)
  const stats = JSON.parse(statsRep.data) as SiteStats
  const needsRefresh = dayjs(stats.recipes.lastRefreshDate).add(featuredRecipesExpirationMinutes, 'minute').isBefore(dayjs())
  if (needsRefresh) {
    stats.recipes.featured = newData
    stats.recipes.lastRefreshDate = dayjs().format()
    await putItem({
      key: siteStatsKey,
      category: siteStatsKey,
      data: stats,
      count: 1,
      expiration: 0,
      last_modified: getUtcNow().format(),
    })
  }
  const featured = needsRefresh ? newData : stats.recipes.featured

  const options: DropdownItem[] = result.items.map((m) => {
    return {
      text: m.title,
      value: m.sys.id,
    }
  })
  const recipeTagOptions = await getRecipeTagOptions(result.items)

  const newOptions = [...options, ...recipeTagOptions]
  const model: RecipesLayoutModel = {
    featured: featured,
    autoComplete: sortArray(newOptions, ['text'], ['asc']),
  }

  return {
    props: {
      model: model,
      fallback: {
        '/api/recipes': model,
      },
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const CachedRecipes = ({ fallbackData }: { fallbackData: RecipesLayoutModel }) => {
  const { data, error, isValidating } = useSWR(['/api/recipes'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalMs,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  if (error) {
    console.error('swr error: ', error)
    return <RecipesLayout featured={fallbackData.featured} />
  }

  return (
    <>
      {isValidating && <BackdropLoader />}
      <RecipesLayout featured={data.featured} />
    </>
  )
}

const Recipes: NextPage<{ model: RecipesLayoutModel; fallback: RecipesLayoutModel }> = ({ model, fallback }) => {
  return (
    <>
      <Seo pageTitle='Recipes' />
      <ResponsiveContainer>
        <PageHeader text='Recipes' />
        <CenterStack sx={{ pt: 2 }}>
          <RecipesSearch autoComplete={model.autoComplete} />
        </CenterStack>
        <SWRConfig value={{ fallback }}>
          <CachedRecipes fallbackData={model} />
        </SWRConfig>
      </ResponsiveContainer>
    </>
  )
}

export default Recipes
