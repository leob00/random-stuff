import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Box, Container } from '@mui/material'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import { getAllRecipes } from 'lib/backend/api/contenfulApi'
import { orderBy, shuffle, take } from 'lodash'
import { Recipe, RecipeCollection } from 'lib/models/cms/contentful/recipe'
import RecipesLayout from 'components/RecipesLayout'
import { Option } from 'lib/AutoCompleteOptions'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { getRandomStuff, putRandomStuff, SiteStats } from 'lib/backend/api/aws/apiGateway'
import dayjs from 'dayjs'
import { getRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const cmsRefreshIntervalSeconds = 3600
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000
const featuredRecipesExpirationMinutes = 30

const siteStatsKey = 'site-stats'

export interface RecipesLayoutModel {
  autoComplete: Option[]
  featured: Recipe[]
}

const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  const result = resp.data as RecipeCollection
  const allItems = result.items

  let newData = take(shuffle(allItems), 10)
  const stats = await getRecord<SiteStats>(siteStatsKey)
  const expirationDate = dayjs(stats.recipes.lastRefreshDate).add(featuredRecipesExpirationMinutes, 'minute')
  const needsRefresh = expirationDate.isBefore(dayjs())
  if (needsRefresh) {
    stats.recipes.featured = newData
    stats.recipes.lastRefreshDate = dayjs().format()
    await putRecord(siteStatsKey, siteStatsKey, stats)
    console.log('fetcherFn:: updated featured recipes.')
  } else {
    console.log(`fetcherFn: no update to featured recipes needed. expires ${dayjs().to(expirationDate)} `)
  }
  const featured = needsRefresh ? newData : stats.recipes.featured

  let options = allItems.map((item) => ({ id: item.sys.id, label: item.title })) as Option[]
  options = orderBy(options, ['label'], ['asc'])
  const model: RecipesLayoutModel = {
    featured: featured,
    autoComplete: options,
  }
  return model
}

export const getStaticProps: GetStaticProps = async (context) => {
  let result = await getAllRecipes()
  const items = result.items
  const newData = take(shuffle(items), 10)
  let options = items.map((item) => ({ id: item.sys.id, label: item.title })) as Option[]
  options = orderBy(options, ['label'], ['asc'])
  const stats = (await getRandomStuff(siteStatsKey)) as SiteStats
  const needsRefresh = dayjs(stats.recipes.lastRefreshDate).add(featuredRecipesExpirationMinutes, 'minute').isBefore(dayjs())
  if (needsRefresh) {
    stats.recipes.featured = newData
    stats.recipes.lastRefreshDate = dayjs().format()
    await putRandomStuff(siteStatsKey, siteStatsKey, stats)
    console.log('build:: updated featured recipes')
  } else {
    console.log('build:: no update to featured recipes needed')
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
    revalidateOnReconnect: true,
  })
  if (error) {
    console.log('swr error: ', error)
    return <RecipesLayout autoComplete={fallbackData.autoComplete} baseUrl='/ssg/recipes/' featured={fallbackData.featured} />
  }
  if (!data) {
    return <Box>loading...</Box>
  }
  return <RecipesLayout autoComplete={data.autoComplete} baseUrl='/ssg/recipes/' featured={data.featured} />
}

const Recipes: NextPage<{ model: RecipesLayoutModel; fallback: RecipesLayoutModel }> = ({ model, fallback }) => {
  return (
    <ResponsiveContainer>
      <BackToHomeButton />
      <SWRConfig value={{ fallback }}>
        <CachedRecipes fallbackData={model} />
      </SWRConfig>
    </ResponsiveContainer>
  )
}

export default Recipes
