import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import { getAllRecipes } from 'lib/backend/api/cms/contenfulApi'
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
import { getRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
dayjs.extend(relativeTime)

const cmsRefreshIntervalSeconds = 86400
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000
const featuredRecipesExpirationMinutes = 1440

const siteStatsKey = 'site-stats'

interface RecipesLayoutModel {
  autoComplete: DropdownItem[]
  featured: Recipe[]
}

const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  const result = resp.data as RecipeCollection
  const allItems = result.items

  let newData = take(shuffle(allItems), 5)
  const stats = await getRecord<SiteStats>(siteStatsKey)
  const expirationDate = dayjs(stats.recipes.lastRefreshDate).add(featuredRecipesExpirationMinutes, 'minute')
  const needsRefresh = expirationDate.isBefore(dayjs())
  if (needsRefresh) {
    stats.recipes.featured = newData
    stats.recipes.lastRefreshDate = dayjs().format()
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
  const newData = take(shuffle(result.items), 5)
  let options: DropdownItem[] = result.items.map((item) => {
    return { value: item.sys.id, text: item.title }
  })
  options = sortArray(options, ['text'], ['asc'])
  const statsRep = await getItem(siteStatsKey)
  const stats = JSON.parse(statsRep.data) as SiteStats
  const needsRefresh = dayjs(stats.recipes.lastRefreshDate).add(featuredRecipesExpirationMinutes, 'minute').isBefore(dayjs())
  if (needsRefresh) {
    stats.recipes.featured = newData
    stats.recipes.lastRefreshDate = dayjs().format()
    await putItem({
      key: siteStatsKey,
      category: siteStatsKey,
      data: JSON.stringify(stats),
    })
  }
  const featured = needsRefresh ? newData : stats.recipes.featured

  const model: RecipesLayoutModel = {
    featured: featured,
    autoComplete: options,
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
    return <RecipesLayout autoComplete={fallbackData.autoComplete} baseUrl='/ssg/recipes/' featured={fallbackData.featured} />
  }

  return (
    <>
      {isValidating && <BackdropLoader />}
      <RecipesLayout autoComplete={data.autoComplete} baseUrl='/ssg/recipes/' featured={data.featured} />
    </>
  )
}

const Recipes: NextPage<{ model: RecipesLayoutModel; fallback: RecipesLayoutModel }> = ({ model, fallback }) => {
  return (
    <>
      <Seo pageTitle='Recipes' />
      <ResponsiveContainer>
        <PageHeader text='Recipes' />
        <SWRConfig value={{ fallback }}>
          <CachedRecipes fallbackData={model} />
        </SWRConfig>
      </ResponsiveContainer>
    </>
  )
}

export default Recipes
