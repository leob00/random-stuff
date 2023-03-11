import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container } from '@mui/material'
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
const featuredRecipesExpirationMinutes = 60

const siteStatsKey = 'site-stats'

export interface RecipesLayoutModel {
  autoComplete: Option[]
  featured: Recipe[]
}

const getSiteStats = async () => {
  const result = (await getRecord(siteStatsKey)) as unknown as SiteStats
  return result
}

const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  const result = resp.data as RecipeCollection
  const allRecipes = result.items

  let newFeatured = take(shuffle(allRecipes), 10)
  const stats = await getSiteStats()
  const expirationDate = dayjs(stats.recipes.lastRefreshDate).add(featuredRecipesExpirationMinutes, 'minute')
  const needsRefresh = expirationDate.isBefore(dayjs())
  if (needsRefresh) {
    stats.recipes.featured = newFeatured
    stats.recipes.lastRefreshDate = dayjs().format()
    await putRecord(siteStatsKey, siteStatsKey, stats)
    console.log('fetcherFn:: updated featured recipes.')
  } else {
    console.log(`fetcherFn: no update to featured recipes needed. expires ${dayjs().to(expirationDate)} `)
  }
  const featured = needsRefresh ? newFeatured : stats.recipes.featured

  let options = allRecipes.map((item) => ({ id: item.sys.id, label: item.title })) as Option[]
  options = orderBy(options, ['label'], ['asc'])
  const model: RecipesLayoutModel = {
    featured: featured,
    autoComplete: options,
  }
  return model
}

export const getStaticProps: GetStaticProps = async (context) => {
  let result = await getAllRecipes()
  const allRecipes = result.items
  const newFeatured = take(shuffle(allRecipes), 10)
  let options = allRecipes.map((item) => ({ id: item.sys.id, label: item.title })) as Option[]
  options = orderBy(options, ['label'], ['asc'])
  const stats = (await getRandomStuff(siteStatsKey)) as SiteStats
  const needsRefresh = dayjs(stats.recipes.lastRefreshDate).add(featuredRecipesExpirationMinutes, 'minute').isBefore(dayjs())
  if (needsRefresh) {
    stats.recipes.featured = newFeatured
    stats.recipes.lastRefreshDate = dayjs().format()
    await putRandomStuff(siteStatsKey, siteStatsKey, stats)
    console.log('build:: updated featured recipes')
  } else {
    console.log('build:: no update to featured recipes needed')
  }
  const featured = needsRefresh ? newFeatured : stats.recipes.featured

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
  const { data, error } = useSWR(['/api/recipes'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalMs,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })
  if (error) {
    return <RecipesLayout autoComplete={fallbackData.autoComplete} baseUrl='/ssg/recipes/' featured={fallbackData.featured} />
  }
  if (!data) {
    return <Container>loading...</Container>
  }

  //let ordered = orderBy(model.items, ['title'], ['asc'])
  //const shuffled = shuffle(featured)
  //const shuffled = shuffleArray(featured)
  return <RecipesLayout autoComplete={data.autoComplete} baseUrl='/ssg/recipes/' featured={data.featured} />
}

const Recipes: NextPage<{ model: RecipesLayoutModel; fallback: RecipesLayoutModel }> = ({ model, fallback }) => {
  /* console.log(model)
  console.log('fallback: ', fallback) */

  //const needRefresh = await needsRefresh()

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
