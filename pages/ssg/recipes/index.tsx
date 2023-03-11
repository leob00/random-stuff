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
import { ModelAttributeAuthAllow } from '@aws-amplify/datastore'

const cmsRefreshIntervalSeconds = 3600
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000

export interface RecipesLayoutModel {
  allRecipes: Recipe[]
  autoComplete: Option[]
  featured: Recipe[]
}

const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  const result = resp.data as RecipeCollection
  const allRecipes = result.items
  const featured = take(shuffle(allRecipes), 10)
  let options = allRecipes.map((item) => ({ id: item.sys.id, label: item.title })) as Option[]
  options = orderBy(options, ['label'], ['asc'])
  const model: RecipesLayoutModel = {
    allRecipes: allRecipes,
    featured: featured,
    autoComplete: options,
  }
  return model
}

export const getStaticProps: GetStaticProps = async (context) => {
  let result = await getAllRecipes()
  const allRecipes = result.items
  const featured = take(shuffle(allRecipes), 10)
  let options = allRecipes.map((item) => ({ id: item.sys.id, label: item.title })) as Option[]
  options = orderBy(options, ['label'], ['asc'])
  const model: RecipesLayoutModel = {
    allRecipes: allRecipes,
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
    revalidateOnReconnect: false,
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
  return <RecipesLayout autoComplete={data.autoComplete} baseUrl='/ssg/recipes/' featured={fallbackData.featured} />
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
